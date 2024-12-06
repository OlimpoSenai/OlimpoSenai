// utils/validarEmail.js

// Função para validar o formato do e-mail
export const validarEmail = (email) => {
    // Regex simples para validar o formato do e-mail
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);  // Retorna true se o e-mail for válido
  };
  
  // Função para formatar o e-mail (converte para minúsculas TESTE DE COMMIT GITHUB)
  export const formatarEmail = (email) => {
    return email.toLowerCase();  // Converte o e-mail para minúsculas
  };
  