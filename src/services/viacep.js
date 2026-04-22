export const fetchAddressByCep = async (cep) => {
  if (!cep) return null;
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) throw new Error('CEP inválido');
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.erro) {
      throw new Error('CEP não encontrado. Verifique os números digitados.');
    }
    return data;
  } catch (error) {
    console.error("ViaCep fetch error:", error);
    
    // Fallback para o BrasilAPI caso o ViaCep bloqueie a requisição do emulador
    try {
      const response2 = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
      if (!response2.ok) throw new Error('CEP não encontrado na BrasilAPI');
      const data2 = await response2.json();
      return {
        logradouro: data2.street,
        bairro: data2.neighborhood,
        localidade: data2.city,
        uf: data2.state
      };
    } catch (fallbackError) {
      console.error("BrasilAPI fetch error:", fallbackError);
      throw new Error('Sem acesso à internet ou CEP inválido. Verifique a conexão do seu emulador/celular.');
    }
  }
};
