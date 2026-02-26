// ============================================================
// CENA 3: GameOver (Tela de Fim de Jogo)
// Exibe a pontuação final e opção de jogar novamente
// ============================================================
class GameOver extends Phaser.Scene {

  constructor() {
    super({ key: 'GameOver' });
  }

  // Recebe dados passados pela cena anterior (pontuação)
  init(data) {
    this.pontuacaoFinal = data.pontuacao || 0;
  }

  // --- CREATE: monta a tela de game over ---
  create() {

    // Fundo (reutiliza o mesmo background)
    this.add.image(400, 300, 'bg');

    // Sobreposição escura
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

    // ---- Animação de entrada: tubarão caindo ----
    const tubaraoFinal = this.add.image(400, -80, 'tubarao').setAlpha(0.6).setTint(0x555555);
    this.tweens.add({
      targets: tubaraoFinal,
      y: 200,
      duration: 1000,
      ease: 'Bounce.easeOut'
    });

    // ---- Título GAME OVER ----
    const tituloGO = this.add.text(400, 90, 'GAME OVER', {
      fontSize: '60px',
      fontFamily: 'Georgia, serif',
      color: '#ff2200',
      stroke: '#440000',
      strokeThickness: 8
    }).setOrigin(0.5).setAlpha(0);

    // Fade in do título
    this.tweens.add({
      targets: tituloGO,
      alpha: 1,
      duration: 800,
      delay: 600
    });

    // ---- Pontuação final ----
    this.add.text(400, 310, 'Sua Pontuação', {
      fontSize: '22px',
      fontFamily: 'Georgia, serif',
      color: '#aaddff'
    }).setOrigin(0.5);

    this.add.text(400, 350, this.pontuacaoFinal + ' pontos', {
      fontSize: '44px',
      fontFamily: 'Georgia, serif',
      color: '#ffdd00',
      stroke: '#664400',
      strokeThickness: 5
    }).setOrigin(0.5);

    // ---- Mensagem baseada na pontuação (estrutura condicional) ----
    let mensagem = '';
    if (this.pontuacaoFinal >= 200) {
      mensagem = '🏆 Incrível! Você é um tubarão lendário!';
    } else if (this.pontuacaoFinal >= 100) {
      mensagem = '🌟 Muito bom! Continue praticando!';
    } else if (this.pontuacaoFinal >= 50) {
      mensagem = '👍 Bom começo! Tente superar sua marca!';
    } else {
      mensagem = '💪 Não desista! Os peixinhos estão te esperando!';
    }

    this.add.text(400, 415, mensagem, {
      fontSize: '17px',
      fontFamily: 'Georgia, serif',
      color: '#ccffee',
      align: 'center'
    }).setOrigin(0.5);

    // ---- Botões de ação ----
    // Botão "Jogar Novamente"
    const btnNovo = this.add.rectangle(400, 480, 240, 50, 0x005599)
      .setStrokeStyle(2, 0x00ccff)
      .setInteractive({ useHandCursor: true });

    const textoBtnNovo = this.add.text(400, 480, '🔄  Jogar Novamente', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#ffffff'
    }).setOrigin(0.5);

    btnNovo.on('pointerover', () => {
      btnNovo.setFillStyle(0x0077cc);
      textoBtnNovo.setColor('#ffff88');
    });
    btnNovo.on('pointerout', () => {
      btnNovo.setFillStyle(0x005599);
      textoBtnNovo.setColor('#ffffff');
    });
    btnNovo.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Botão "Menu Principal"
    const btnMenu = this.add.rectangle(400, 545, 240, 50, 0x003311)
      .setStrokeStyle(2, 0x00aa44)
      .setInteractive({ useHandCursor: true });

    const textoBtnMenu = this.add.text(400, 545, '🏠  Menu Principal', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#aaffaa'
    }).setOrigin(0.5);

    btnMenu.on('pointerover', () => {
      btnMenu.setFillStyle(0x005522);
      textoBtnMenu.setColor('#ffffff');
    });
    btnMenu.on('pointerout', () => {
      btnMenu.setFillStyle(0x003311);
      textoBtnMenu.setColor('#aaffaa');
    });
    btnMenu.on('pointerdown', () => {
      this.scene.start('Welcome');
    });

    // Tecla R para reiniciar
    this.input.keyboard.on('keydown-R', () => {
      this.scene.start('GameScene');
    });

    // Bolhas de fundo (reutiliza lógica)
    this.bolhas = [];
    for (let i = 0; i < 12; i++) {
      const bx = Phaser.Math.Between(20, 780);
      const by = Phaser.Math.Between(50, 580);
      const br = Phaser.Math.Between(3, 9);
      const b = this.add.circle(bx, by, br, 0x88ccff, 0.2);
      this.bolhas.push({ obj: b, vel: Phaser.Math.FloatBetween(0.3, 1.1) });
    }

  } // fim create()

  // Animação contínua das bolhas
  update() {
    for (let i = 0; i < this.bolhas.length; i++) {
      this.bolhas[i].obj.y -= this.bolhas[i].vel;
      if (this.bolhas[i].obj.y < -10) {
        this.bolhas[i].obj.y = 610;
        this.bolhas[i].obj.x = Phaser.Math.Between(20, 780);
      }
    }
  }

} // fim classe GameOver