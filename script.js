document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const statusArea = document.getElementById('statusArea');
    const statusMessage = document.getElementById('statusMessage');

    downloadBtn.addEventListener('click', async () => {
        const url = videoUrlInput.value.trim();

        if (!url) {
            alert("Por favor, insira um link válido!");
            return;
        }

        // Reseta o estilo caso tenha dado erro na tentativa anterior
        statusMessage.style.color = "#fff";
        statusArea.classList.remove('hidden');
        statusMessage.textContent = "Conectando ao servidor público... aguarde.";
        downloadBtn.disabled = true;
        downloadBtn.textContent = "Buscando...";

        try {
            // Faz a requisição para a API pública e gratuita do Cobalt
            const response = await fetch('https://api.cobalt.tools/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: url
                })
            });

            if (!response.ok) {
                throw new Error("Erro na comunicação com a API pública.");
            }

            const data = await response.json();

            if (data.status === 'error') {
                throw new Error(data.text || "A API não conseguiu processar este vídeo.");
            }

            // O Cobalt retorna o link final direto na propriedade 'url'
            const downloadLink = data.url;

            // Cria um botão visualmente agradável com o link de download
            statusMessage.innerHTML = `
                Vídeo processado com sucesso! <br><br> 
                <a href="${downloadLink}" target="_blank" style="color: #121212; background-color: #bb86fc; text-decoration: none; font-weight: bold; padding: 10px 20px; border-radius: 8px; display: inline-block; margin-top: 10px; transition: 0.3s;">
                    Baixar Arquivo
                </a>
            `;
            
        } catch (error) {
            // Tratamento de erros elegante
            statusMessage.innerHTML = `Ocorreu um erro: ${error.message}`;
            statusMessage.style.color = "#ff5555"; // Vermelho claro para indicar erro no Dark Mode
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.textContent = "Baixar Novo Vídeo";
            videoUrlInput.value = ''; // Limpa o input para o próximo uso
        }
    });
});