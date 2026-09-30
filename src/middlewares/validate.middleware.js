export const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(" ");
    return res.status(400).json({
      error: "Datos inválidos.",
      message
    });
  }

  req.validated ??= {};
  req.validated[source] = result.data;
  next();
};
