module.exports = (app) => {
  // Existe ou erro -> Se existir passa pela função, senão ERROR!!!
  // TEM QUE EXISTIR!!!!
  function existsOrError(value, msg) {
    if (!value) {
      throw msg;
    } else if (Array.isArray(value) && value.length === 0) {
      throw msg;
    } else if (typeof value === "string" && !value.trim()) {
      throw msg;
    } else {
      return;
    }
  }

  // Se não existir passa, senão ERROR!!!
  // TEM QUE NÃO EXISTIR!!!
  function notExistsOrError(value, msg) {
    try {
      existsOrError(value, msg);
    } catch (msg) {
      // Se não existir ele passa tranquilo
      return;
    }
    // Se existir ele lança o erro
    throw msg;
  }

  // Dois valores se são iguais ou não
  function equalsOrError(valueA, valueB, msg) {
    if (valueA !== valueB) {
      throw msg;
    }
  }

  return {
    existsOrError,
    notExistsOrError,
    equalsOrError,
  };
};
