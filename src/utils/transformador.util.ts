type RegistroGenerico = Record<string, unknown>;

export class Transformador {
  public static extraerDataValues<T>(resultado: unknown): T {
    if (
      resultado === undefined ||
      resultado === null ||
      (Array.isArray(resultado) && resultado.length === 0) ||
      (Transformador.esObjetoConRows(resultado) && resultado.rows.length === 0)
    ) {
      return resultado as T;
    }

    if (Array.isArray(resultado)) {
      const itemsNormalizados = resultado.map((item) =>
        Transformador.extraerDataValues<unknown>(item),
      );
      return itemsNormalizados as unknown as T;
    }

    if (Transformador.esObjetoConRows(resultado)) {
      const filasNormalizadas = resultado.rows.map((item) =>
        Transformador.extraerDataValues<unknown>(item),
      );
      return {
        ...resultado,
        rows: filasNormalizadas,
      } as unknown as T;
    }

    if (Transformador.esObjetoConDataValues(resultado)) {
      const datos: RegistroGenerico = { ...resultado.dataValues };
      Object.keys(datos).forEach((clave) => {
        const valor = datos[clave];
        if (
          valor &&
          typeof valor === 'object' &&
          !(valor instanceof Date)
        ) {
          datos[clave] = Transformador.extraerDataValues<unknown>(valor);
        }
      });
      return datos as unknown as T;
    }

    if (Transformador.esObjeto(resultado)) {
      const datos: RegistroGenerico = { ...(resultado as RegistroGenerico) };
      Object.keys(datos).forEach((clave) => {
        const valor = datos[clave];
        if (valor && typeof valor === 'object') {
          datos[clave] = Transformador.extraerDataValues<unknown>(valor);
        }
      });
      return datos as unknown as T;
    }

    return resultado as T;
  }

  private static esObjeto(valor: unknown): valor is RegistroGenerico {
    return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
  }

  private static esObjetoConDataValues(
    valor: unknown,
  ): valor is { dataValues: RegistroGenerico } {
    return (
      Transformador.esObjeto(valor) &&
      'dataValues' in valor &&
      typeof valor.dataValues === 'object' &&
      valor.dataValues !== null
    );
  }

  private static esObjetoConRows(
    valor: unknown,
  ): valor is { rows: unknown[] } {
    return (
      Transformador.esObjeto(valor) &&
      'rows' in valor &&
      Array.isArray(valor.rows)
    );
  }
}

