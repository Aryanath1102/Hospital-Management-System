const cds = require('@sap/cds');
const { SELECT, UPDATE } = cds.ql;

const MAX_RETRIES = 5;

const getNextNumber = async (req, NumberRanges, object) => {

    const tx = cds.tx(req);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

        // Read current number
        const range = await tx.run(
            SELECT.one
                .from(NumberRanges)
                .where({ Object: object })
        );

        if (!range) {
            req.error(500, `Number range '${object}' is not configured.`);
        }

        const current = range.CurrentNumber;
        const next = current + 1;

        // Optimistic update
        const updated = await tx.run(
            UPDATE(NumberRanges)
                .set({ CurrentNumber: next })
                .where({
                    Object: object,
                    CurrentNumber: current
                })
        );

        // Success
        if (updated > 0) {
            return next;
        }

        // Someone updated first → retry
    }

    req.error(500, `Failed to generate next number for '${object}'.`);
};

module.exports = {
    getNextNumber
};