import z from "zod/v3";

export function zodToRaw(schema: any): any {
      // 1. Cria o validador base (z.string(), z.number(), etc.)
            // Usamos 'let' para poder modificar o validador em etapas.
            let validator = z[schema.type]();
    
            // 2. Adiciona a descrição (se existir)
            if (schema.description) {
              validator = validator.describe(schema.description);
            }
    
            // 3. Adiciona as restrições de tamanho/valor ✨
            // -> Caso especial para tamanho fixo (string.length)
            if (schema.minLength !== undefined && schema.minLength === schema.maxLength) {
              validator = validator.length(schema.minLength);
            } else {
              // -> Caso geral para min/max (funciona para string e number)
              const min = schema.minLength ?? schema.minimum;
              if (min !== undefined) {
                validator = validator.min(min);
              }
    
              const max = schema.maxLength ?? schema.maximum;
              if (max !== undefined) {
                validator = validator.max(max);
              }
            }
                  // 4. Atribui o validador final, já configurado, ao nosso objeto 'shape'
            
    
            return validator;
}