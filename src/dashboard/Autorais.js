import React, { useState } from 'react';

const Autorais = () => {
  const [expandedSong, setExpandedSong] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyLyrics = async (lyrics) => {
    try {
      await navigator.clipboard.writeText(lyrics);
      setCopySuccess('Copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Falha ao copiar');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const songs = [
    {
      id: 1,
      title: "Saudade Tropical",
      releaseDate: "2022-12-15",
      spotifyId: "3RFCJaysZZhCoPdfJebzCa",
      links: {
        spotify: "https://open.spotify.com/track/3RFCJaysZZhCoPdfJebzCa",
        appleMusic: "https://music.apple.com/...",
        youtube: "https://youtube.com/..."
      },
      credits: {
        composers: ["Carlos Pitty", "Derik Rios"],
        producers: ["Ledsley"],
        musicians: [
          "JP - Voz",
          "Derik - Voz"
        ]
      },
      description: `Essa música traz um retrato bem-humorado e sincero da experiência de muitos brasileiros que foram para o exterior em busca de oportunidades, mas sentem saudade de casa. A letra brinca com o dilema clássico: ganhar em dólar pode ser bom, mas o coração sempre bate forte pelo Brasil e tudo o que faz parte da cultura brasileira.

A mensagem principal é: "A vida fora do Brasil pode ter vantagens, mas nada substitui as raízes, as pessoas queridas e o clima tropical."

O som segue a pegada pagonejo, com um ritmo envolvente e fácil de cantar junto, reforçando o tom leve e descontraído da música. A repetição dos versos destaca a saudade das coisas simples que fazem falta, como sol, cerveja, samba, churrasco e futebol, criando uma identificação instantânea com o público.

Elementos principais da música:
✅ A distância física entre o Brasil e quem mora fora (10 mil km)
✅ O contraste entre o frio da gringa e o calor humano do Brasil
✅ A busca por melhores condições financeiras, mas sem perder as raízes
✅ A saudade forte das pessoas e da cultura brasileira
✅ A pegada bem-humorada de quem ganha bem, mas ainda assim quer voltar

A estrutura da letra é repetitiva e fácil de memorizar, reforçando a ideia da saudade insistente e do desejo de voltar. O refrão tem um apelo forte, citando elementos icônicos do Brasil que despertam nostalgia instantânea.

O tom da música é divertido, dançante e ao mesmo tempo cheio de verdade, trazendo um equilíbrio perfeito entre curtição e emoção. O público-alvo – brasileiros vivendo fora – com certeza vai se identificar e cantar junto, tornando essa música um hino da saudade brasileira na gringa.`,
      lyrics: `São 10 mil km separando gente
Tô pisando na neve mas a saudade tá quente
Eu vim fazer a vida e logo eu vou voltar
Já já eu tô ai Brasil pode me esperar

Ganhando em dólar
Mas na real e que eu tô doido pra ir embora
Ganhando em dólar
Mas na real

Saudade de você e do clima tropical
Sol, cerveja, samba e futebol
Saudade de você e do clima tropical
Sol, cerveja, churrasco e futebol

São 10 mil km separando gente
Tô pisando na neve mas a saudade tá quente
Eu vim fazer a vida e logo eu vou voltar
Já já eu tô ai Brasil pode me esperar

Ganhando em dólar
Mas na real e que eu tô doido pra ir embora
Ganhando em dólar
Mas na real

Saudade de você e do clima tropical
Sol, cerveja, samba e futebol
Saudade de você e do clima tropical
Sol, cerveja, churrasco e futebol

Ai que saudade, ein?
De Sol, cerveja, samba e futebol
Saudade de você e do clima tropical
Sol, cerveja, churrasco e futebol`
    },
    {
      id: 2,
      title: "Aqui Tem Tudo, Só Falta...",
      releaseDate: "2023-08-20",
      spotifyId: "3yGMZ9CmLHxHLhgKHlu61P",
      links: {
        spotify: "https://open.spotify.com/track/3yGMZ9CmLHxHLhgKHlu61P",
        appleMusic: "https://music.apple.com/...",
        youtube: "https://youtube.com/..."
      },
      credits: {
        composers: ["Eleno Henrique Santana"],
        producers: ["Ledsley"],
        musicians: [
          "JP - Voz",
          "Derik - Voz"
        ]
      },
      description: `Essa música fala sobre a experiência de quem saiu do Brasil para buscar novas oportunidades em outro país, mas sente a falta das pessoas que ama. É uma carta aberta para aqueles que ficaram, transmitindo um misto de saudade e realização.

A mensagem principal é: "Estou vivendo meu sonho, conquistando o mundo, mas sinto falta de você."

A sonoridade traz elementos do sertanejo com pegada de pagonejo, conectando com a identidade da dupla. A letra reforça a dualidade entre a vida nova, que está dando certo, e a saudade de quem faz falta.

Elementos importantes da música:
✅ Nostalgia e saudade de quem ficou no Brasil
✅ Vida nova no exterior, enfrentando desafios, mas se adaptando
✅ Conexão com a cultura brasileira através da música e dos costumes
✅ Sensação de "estar quase completo", mas ainda faltando algo essencial

A estrutura da letra usa versos diretos e emocionais para gerar identificação com quem mora fora. O refrão destaca o sentimento principal de forma simples e forte: "Aqui tem tudo, só falta você."

O tom da música é emotivo, mas sem ser triste – é mais sobre valorizar os momentos e reconhecer a importância das pessoas queridas. A melodia e o ritmo garantem que a música não seja melancólica, mas sim envolvente e cheia de identidade brasileira.`,
      lyrics: `E por aqui tá tudo bem
Se não tiver a gente dá um jeito pra poder ficar

E como tá ai, meu bem?
Eu sei que já passou um tempo
Mas logo eu vou voltar!

Tô escrevendo essa carta aberta
Pra quem eu deixei em outro país
Às vezes eu mato a saudade
Escutando samba, MPB ou modão raiz

Mas eu quero que saiba
Que tô conquistando o mundo
Do jeito que eu sempre quis

Eu tô com saudade, é verdade
Mas aqui tá dando
Pra se virar

Eu me sinto em casa
Aqui tem gelada
E tem samba pra gente sambar

Eu tô com saudade
Mas se quer saber
Aqui tem tudo
Só falta você

Eu tô com saudade
Mas se quer saber
Aqui tem tudo
Só falta você`
    },
    {
      id: 3,
      title: "Sotaque Brasileiro",
      releaseDate: "2024-01-10",
      spotifyId: "5vTqVCQqBXObGmtH4vwKW9",
      links: {
        spotify: "https://open.spotify.com/track/5vTqVCQqBXObGmtH4vwKW9",
        appleMusic: "https://music.apple.com/...",
        youtube: "https://youtube.com/..."
      },
      credits: {
        composers: ["JP Vilela", "Derik"],
        producers: ["Ledsley"],
        musicians: [
          "JP - Voz",
          "Derik - Voz"
        ]
      },
      description: `Essa música fala sobre a experiência de ser um brasileiro morando fora e enfrentando a barreira do idioma, mas usando o carisma e o jeito brasileiro para se conectar com as pessoas. A história traz um tom leve e divertido, mostrando que mesmo sem dominar o inglês perfeitamente, o protagonista se vira e ainda conquista corações com seu sotaque e seu jeito único.

A mensagem principal é: "Posso estar em outro país, mas meu jeito brasileiro sempre me destaca."

A sonoridade traz uma pegada animada de pagonejo, criando uma vibe envolvente e descontraída. A letra aposta no humor e no charme natural do brasileiro, reforçando a ideia de que, mesmo sendo estrangeiro, o protagonista conquista espaço e se adapta do jeito dele.

Elementos importantes da música:
✅ A dificuldade inicial com o idioma, mas sem medo de errar
✅ O sotaque brasileiro sendo um diferencial positivo
✅ A espontaneidade e carisma do brasileiro na gringa
✅ Um flerte leve e divertido, mostrando a confiança do protagonista

A estrutura da letra segue uma narrativa leve, mostrando um crescimento – do receio inicial ao momento de autoconfiança. O refrão destaca o sotaque brasileiro como um trunfo, algo que chama atenção e desperta interesse.

O tom da música é descontraído, alegre e cheio de personalidade. A melodia e o ritmo fazem dela uma faixa perfeita para embalar momentos animados, trazendo um pouco da identidade brasileira para quem está longe de casa.`,
      lyrics: `Cheguei nesse lugar estranho
Ninguém entende o que eu tô falando

O meu inglês é um pouco limitado
Mas eu tô me arriscando
Às vezes falo tudo errado
Às vezes falo gaguejando
Mas já tô me comunicando

E ontem mesmo já cheguei puxando assunto
Com a mina no elevador
Só fiquei meio confuso quando ela me perguntou
De onde é que eu sou
O meu sotaque me entregou

E ela pirou no meu sotaque brasileiro
No meu jeitinho de chegar bem sorrateiro
O meu I love you pra ela tem outro tempero
É que aqui na gringa
Eu que sou o estrangeiro`
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Autorais</h2>
      <div className="space-y-6">
        {songs.map((song) => (
          <div key={song.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => setExpandedSong(expandedSong === song.id ? null : song.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{song.title}</h3>
                  <p className="text-sm text-gray-400">
                    Lançamento: {new Date(song.releaseDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {Object.entries(song.links).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {platform === 'spotify' && 'Spotify'}
                      {platform === 'appleMusic' && 'Apple Music'}
                      {platform === 'youtube' && 'YouTube'}
                    </a>
                  ))}
                </div>
              </div>

              {expandedSong === song.id && (
                <div className="mt-4 space-y-6 border-t border-gray-700 pt-4">
                  {/* Song Analysis */}
                  <div className="bg-gray-900 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4 text-lg text-blue-400">Sobre a música</h4>
                    
                    {/* Introduction */}
                    <div className="mb-6">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {song.description.split('\n\n').find(section => !section.startsWith('A mensagem') && 
                          !section.startsWith('O som') && 
                          !section.startsWith('Elementos') && 
                          !section.startsWith('A estrutura') && 
                          !section.startsWith('O tom'))}
                      </p>
                    </div>

                    {/* Main Message */}
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold mb-2 text-gray-400">Mensagem Principal</h5>
                      <p className="text-sm text-gray-300 italic">
                        {song.description
                          .split('\n\n')
                          .find(section => section.startsWith('A mensagem'))
                          ?.replace('A mensagem principal é: ', '')
                          .replace(/^"/, '')
                          .replace(/"$/, '')}
                      </p>
                    </div>

                    {/* Sound Description */}
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold mb-2 text-gray-400">Sonoridade</h5>
                      <p className="text-sm text-gray-300">
                        {song.description
                          .split('\n\n')
                          .find(section => section.startsWith('O som') || section.startsWith('A sonoridade'))}
                      </p>
                    </div>

                    {/* Key Elements */}
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold mb-2 text-gray-400">Elementos Importantes</h5>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        {song.description
                          .split('\n\n')
                          .find(section => section.startsWith('Elementos'))
                          ?.split('\n')
                          .slice(1)
                          .map((element, index) => (
                            <p key={index} className="text-sm text-gray-300 mb-1">
                              {element}
                            </p>
                          ))}
                      </div>
                    </div>

                    {/* Structure */}
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold mb-2 text-gray-400">Estrutura</h5>
                      <p className="text-sm text-gray-300">
                        {song.description
                          .split('\n\n')
                          .find(section => section.startsWith('A estrutura'))}
                      </p>
                    </div>

                    {/* Tone */}
                    <div>
                      <h5 className="text-sm font-semibold mb-2 text-gray-400">Tom e Clima</h5>
                      <p className="text-sm text-gray-300">
                        {song.description
                          .split('\n\n')
                          .find(section => section.startsWith('O tom'))}
                      </p>
                    </div>
                  </div>

                  {/* Lyrics */}
                  <div className="bg-gray-900 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-lg text-blue-400">Letra</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLyrics(song.lyrics);
                        }}
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                      >
                        {copySuccess || 'Copiar letra'}
                      </button>
                    </div>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {song.lyrics}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Autorais; 