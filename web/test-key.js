const API_KEY = "AIzaSyB1aEoXx3F7wSRzDqnWi9aK0vm3qJt9bh4"; 

async function listarModelos() {
  console.log("🔍 Consultando API do Google...");
  
  try {
    // Vamos direto na API REST, sem passar por biblioteca que pode estar desatualizada
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ ERRO DE PERMISSÃO/CHAVE:");
      console.error(data.error.message);
      return;
    }

    console.log("✅ SUCESSO! Modelos disponíveis para sua chave:");
    console.log("------------------------------------------------");
    
    // Filtra apenas modelos que geram texto (chat)
    const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    chatModels.forEach(m => {
      // Limpa o prefixo 'models/' para mostrar só o nome que precisamos usar
      console.log(`🎯 ${m.name.replace("models/", "")}`);
    });
    
    console.log("------------------------------------------------");
    console.log("👉 Escolha um desses nomes e coloque no seu código!");

  } catch (error) {
    console.error("Erro de conexão:", error);
  }
}

listarModelos();