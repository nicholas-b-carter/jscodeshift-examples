

export default function transformer(file, api, options) {
  const j = api.jscodeshift;

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
    lineTerminator: '\n',
  };

  const root = j(file.source);

  const isStaticGet = path => (
    path.node.static && path.node.kind === 'get'
  );

  const getReturnStatement = path => {
    const out = j.classProperty(
      j.identifier(path.node.key.name),
      path.node.value.body.body[0].argument,
      null,
      true
    );
    return out;
  };

  root
    .find(j.MethodDefinition)
    .filter(isStaticGet)
    .replaceWith(getReturnStatement);

  return root.toSource(printOptions);
}