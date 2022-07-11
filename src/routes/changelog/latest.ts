export const get: import("@sveltejs/kit").RequestHandler = async ({
  locals,
}) => {
  const { date } = locals.changelogEntries[0];
  return {
    body: {
      date,
    },
  };
};
