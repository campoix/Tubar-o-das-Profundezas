// ============================================================
// CENA 1: Welcome (Tela de Boas-Vindas)
// Apresenta o título do jogo e as instruções de controle
// ============================================================
class Welcome extends Phaser.Scene {

  constructor() {
    super({ key: 'Welcome' }); // Chave única da cena
  }

  // --- PRELOAD: carrega todos os assets usados no jogo ---
  preload() {
    // Carrega imagens de fundo, personagem e elementos
    this.load.image('bg', 'assets/bg_azul-escuro.png');
    this.load.image('tubarao', 'assets/tubarao.png');
    this.load.image('peixinho', 'assets/peixinho_laranja.png');
    this.load.image('concha', 'assets/conha.png');
  }

  // --- CREATE: configura os elementos visuais da tela de boas-vindas ---
  create() {

    // Fundo do oceano
    this.add.image(400, 300, 'bg');

    // Sobreposição escura semitransparente para dar profundidade
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000d1a, 0.55);

    // ---- Partículas de bolhas decorativas ----
    this.bolhas = []; // Lista para armazenar posições das bolhas
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(20, 780);
      const y = Phaser.Math.Between(50, 580);
      const raio = Phaser.Math.Between(3, 10);
      const bolha = this.add.circle(x, y, raio, 0x88ccff, 0.3);
      this.bolhas.push({ obj: bolha, velocidade: Phaser.Math.FloatBetween(0.3, 1.2) });
    }

    // ---- Título do jogo ----
    this.add.text(400, 100, '🦈 TUBARÃO DAS PROFUNDEZAS', {
      fontSize: '32px',
      fontFamily: 'Georgia, serif',
      color: '#00e5ff',
      stroke: '#003366',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5);

    // Subtítulo
    this.add.text(400, 148, 'Um tubarão faminto nas profundezas do oceano', {
      fontSize: '16px',
      fontFamily: 'Georgia, serif',
      color: '#80d4ff',
      align: 'center'
    }).setOrigin(0.5);

    // ---- Prévia do personagem (tubarão) ----
    const tubaraoPreview = this.add.image(400, 270, 'tubarao').setScale(1.2);

    // Efeito de flutuação no tubarão da tela inicial (animação via tween)
    this.tweens.add({
      targets: tubaraoPreview,
      y: 285,
      duration: 1200,
      ease: 'Sine.easeInOut',
      yoyo: true,    // Volta ao estado original
      repeat: -1     // Repete infinitamente
    });

    // ---- Painel de instruções "Como Jogar" ----
    const painelX = 400;
    const painelY = 390;

    // Fundo do painel
    this.add.rectangle(painelX, painelY, 500, 145, 0x001933, 0.85)
      .setStrokeStyle(2, 0x00aaff);

    // Título do painel
    this.add.text(painelX, painelY - 55, '🎮 COMO JOGAR', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#ffdd00',
      stroke: '#664400',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Lista de controles do jogo
    const controles = [
      '⬆  Seta CIMA     → Mover para cima',
      '⬇  Seta BAIXO  → Mover para baixo',
      '⬅  Seta ESQ      → Mover para esquerda',
      '➡  Seta DIR       → Mover para direita',
    ];

    // Usa estrutura de repetição (for) para criar cada linha de controle
    for (let i = 0; i < controles.length; i++) {
      this.add.text(painelX, painelY - 25 + i * 26, controles[i], {
        fontSize: '14px',
        fontFamily: 'Courier New, monospace',
        color: '#cceeff'
      }).setOrigin(0.5);
    }

    // ---- Objetivo do jogo ----
    this.add.text(400, 475, '🐟 Coma os peixinhos laranjas para ganhar pontos!\n🐚 Evite as conchas — elas te machucam!', {
      fontSize: '14px',
      fontFamily: 'Georgia, serif',
      color: '#aaddff',
      align: 'center'
    }).setOrigin(0.5);

    // ---- Botão de iniciar ----
    const btnFundo = this.add.rectangle(400, 545, 220, 48, 0x005599)
      .setStrokeStyle(2, 0x00ccff)
      .setInteractive({ useHandCursor: true });

    const btnTexto = this.add.text(400, 545, '▶  JOGAR AGORA', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Efeito hover no botão
    btnFundo.on('pointerover', () => {
      btnFundo.setFillStyle(0x0077cc);
      btnTexto.setColor('#ffff88');
    });

    btnFundo.on('pointerout', () => {
      btnFundo.setFillStyle(0x005599);
      btnTexto.setColor('#ffffff');
    });

    // Clique inicia o jogo
    btnFundo.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Tecla ENTER também inicia o jogo
    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });

    // Tecla SPACE também inicia
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

  } // fim create()

  // --- UPDATE: animação contínua das bolhas ---
  update() {
    // Condição de repetição: move cada bolha para cima
    for (let i = 0; i < this.bolhas.length; i++) {
      this.bolhas[i].obj.y -= this.bolhas[i].velocidade;

      // Se a bolha saiu da tela, reposiciona na parte de baixo
      if (this.bolhas[i].obj.y < -10) {
        this.bolhas[i].obj.y = 610;
        this.bolhas[i].obj.x = Phaser.Math.Between(20, 780);
      }
    }
  }

} // fim classe Welcome