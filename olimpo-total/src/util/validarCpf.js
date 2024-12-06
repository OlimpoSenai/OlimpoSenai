// utils/validarCpf.js

// Função para validar o CPF
export const validarCpf = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');
  
    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;
  
    // Verifica se o CPF é um número repetido (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;
  
    // Valida o primeiro dígito verificador
    let soma = 0;
    let peso = 10;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
  
    // Valida o segundo dígito verificador
    soma = 0;
    peso = 11;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--;
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
  
    return true;  // CPF válido
  };
  
  // Função para formatar o CPF (XXX.XXX.XXX-XX)
  export const formatarCpf = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  