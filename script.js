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

        statusMessage.style.color = "#fff";
        statusArea.classList.remove('hidden');
        statusMessage.textContent = "Conectando através de proxy seguro... aguarde.";
        downloadBtn.disabled = true;
        downloadBtn.textContent = "Buscando...";

        try {
            // A URL da API que queremos acessar
            const targetUrl = 'https://api.cobalt.tools/';
            
            // A URL do proxy juntamente com a URL alvo criptografada
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

            // Fazemos o fetch no Proxy, não direto no Cobalt
            const response = await fetch(proxyUrl, {
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
                throw new Error(`A API rejeitou a conexão (Erro ${response.status}).`);
            }

            const data = await response.json();

            if (data.status === 'error') {
                throw new Error(data.text || "A API não conseguiu processar este vídeo.");
            }

            const downloadLink = data.url;

            // Sucesso! Mostra o botão de download
            statusMessage.innerHTML = `
                 Vídeo processado com sucesso! <br><br> 
                <a href="${downloadLink}" target="_blank" style="color: #121212; background-color: #bb86fc; text-decoration: none; font-weight: bold; padding: 10px 20px; border-radius: 8px; display: inline-block; margin-top: 10px; transition: 0.3s;">
                     Baixar Arquivo
                </a>
            `;
            
        } catch (error) {
            // Tratamento de erro elegante para o usuário final
            statusMessage.innerHTML = `
                 Ocorreu um erro: ${error.message} <br><br> 
                <span style="font-size: 0.85em; color: #a0a0a0;">
                Servidores públicos podem estar sobrecarregados no momento.
                </span>
            `;
            statusMessage.style.color = "#ff5555";
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.textContent = "Baixar Novo Vídeo";
            videoUrlInput.value = ''; 
        }
    });
});