// ============================================================
// CENA 2: GameScene (Fase Principal Jogável)
// O tubarão se move pelo oceano, come peixinhos e evita conchas
// ============================================================
class GameScene extends Phaser.Scene {

  constructor() {
    super({ key: 'GameScene' });
  }

  // --- CREATE: configura todos os elementos da fase ---
  create() {

    // ---- Fundo do oceano ----
    this.add.image(400, 300, 'bg');

    // ---- Variáveis de estado do jogo ----
    this.pontuacao = 0;       // Pontos acumulados
    this.vidas = 3;           // Número de vidas do tubarão
    this.velocidadeTubarao = 220; // Pixels por segundo
    this.jogoAtivo = true;    // Controla se o jogo está rodando

    // ---- Tubarão (personagem principal) ----
    // Posicionado no centro-esquerda da tela
    this.tubarao = this.physics.add.sprite(150, 300, 'tubarao');
    this.tubarao.setCollideWorldBounds(true); // Não sai da tela
    // ---- Animação de nado (ondulação do tubarão) ----
    this.tweenNado = this.tweens.add({
      targets: this.tubarao,
      angle: { from: -5, to: 5 }, // balanço suave
      duration: 600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // ---- Efeito especial de "turbo" (brilho ao acelerar) ----
    this.turboAtivo = false;
    this.turboTimer = 0;

    // ---- Grupos de objetos ----
    // Grupo de peixinhos (alvos para pontuação)
    this.grupoPeixinhos = this.physics.add.group();

    // Grupo de conchas (obstáculos / colisão)
    this.grupoConchas = this.physics.add.group();

    // ---- Temporizadores para spawnar objetos ----
    // Cria um peixinho a cada 1.8 segundos
    this.timerPeixinho = this.time.addEvent({
      delay: 1800,
      callback: this.criarPeixinho,
      callbackScope: this,
      loop: true
    });

    // Cria uma concha a cada 2.5 segundos
    this.timerConcha = this.time.addEvent({
      delay: 2500,
      callback: this.criarConcha,
      callbackScope: this,
      loop: true
    });

    // ---- HUD: interface de pontuação e vidas ----
    // Painel semitransparente na parte superior
    this.add.rectangle(400, 20, 800, 40, 0x000d1a, 0.75);

    // Texto de pontuação
    this.textoPontuacao = this.add.text(20, 8, 'Pontos: 0', {
      fontSize: '20px',
      fontFamily: 'Georgia, serif',
      color: '#00e5ff'
    });

    // Texto de vidas (corações)
    this.textoVidas = this.add.text(650, 8, '❤️ ❤️ ❤️', {
      fontSize: '18px',
      fontFamily: 'Arial'
    });

    // Texto de nível de velocidade
    this.textoNivel = this.add.text(290, 8, 'Nível: 1', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#ffdd00'
    });

    // ---- Controles do teclado ----
    this.cursores = this.input.keyboard.createCursorKeys();

    // Tecla SHIFT para ativar turbo
    this.teclaShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // ---- OVERLAP: tubarão come peixinho ----
    // Quando o tubarão sobrepõe um peixinho, chama comerPeixinho()
    this.physics.add.overlap(
      this.tubarao,
      this.grupoPeixinhos,
      this.comerPeixinho,
      null,
      this
    );

    // ---- COLISÃO: tubarão bate em concha ----
    // Quando o tubarão colide com uma concha, chama levarDano()
    this.physics.add.overlap(
      this.tubarao,
      this.grupoConchas,
      this.levarDano,
      null,
      this
      
    );
    

    // ---- Bolhas decorativas em movimento ----
    this.bolhasJogo = [];
    for (let i = 0; i < 15; i++) {
      const bx = Phaser.Math.Between(0, 800);
      const by = Phaser.Math.Between(0, 600);
      const br = Phaser.Math.Between(2, 8);
      const bolha = this.add.circle(bx, by, br, 0x88ccff, 0.25);
      this.bolhasJogo.push({
        obj: bolha,
        vel: Phaser.Math.FloatBetween(0.4, 1.5)
      });
    }

    // ---- Linha de "fundo do oceano" (barreira visual) ----
    this.add.rectangle(400, 592, 800, 16, 0x5c3a1e); // Areia
    this.add.text(10, 578, '〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰', {
      fontSize: '12px',
      color: '#c4a35a',
      alpha: 0.6
    });

  } // fim create()

  // ============================================================
  // Cria um peixinho laranja do lado direito da tela
  // ============================================================
  criarPeixinho() {
    if (!this.jogoAtivo) return;

    // Posição Y aleatória (evita borda superior e inferior)
    const y = Phaser.Math.Between(50, 550);

    // Adiciona o peixinho no grupo, do lado direito
    const peixinho = this.grupoPeixinhos.create(850, y, 'peixinho');
    peixinho.setScale(0.8);

    // Velocidade negativa = move da direita para a esquerda
    // Aumenta conforme a pontuação (dificuldade progressiva)
    const velocidadeBase = -180;
    const bonusVelocidade = Math.floor(this.pontuacao / 50) * -20;
    peixinho.setVelocityX(velocidadeBase + bonusVelocidade);

    // Pequena variação vertical para parecer mais natural
    peixinho.setVelocityY(Phaser.Math.Between(-30, 30));

    // Destrói o peixinho se sair pela esquerda
    peixinho.setCollideWorldBounds(false);
  }

  // ============================================================
  // Cria uma concha (obstáculo) que vem da direita
  // ============================================================
  criarConcha() {
    if (!this.jogoAtivo) return;

    const y = Phaser.Math.Between(50, 550);
    const concha = this.grupoConchas.create(850, y, 'concha');
    concha.setScale(1.5); // Deixa visível

    // Velocidade variável para dificultar esquivar
    const vel = Phaser.Math.Between(-200, -250);
    concha.setVelocityX(vel);

    // Movimento em zigue-zague vertical
    this.tweens.add({
      targets: concha,
      y: y + Phaser.Math.Between(-80, 80),
      duration: 600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  // ============================================================
  // Callback: tubarão comeu um peixinho (OVERLAP)
  // ============================================================
  comerPeixinho(tubarao, peixinho) {
    // Remove o peixinho da cena
    peixinho.destroy();

    // Incrementa pontuação
    this.pontuacao += 10;
    this.textoPontuacao.setText('Pontos: ' + this.pontuacao);

    // Atualiza o nível conforme pontuação
    const nivel = Math.floor(this.pontuacao / 50) + 1;
    this.textoNivel.setText('Nível: ' + nivel);

    // Efeito visual: flash verde no tubarão ao comer
    this.tubarao.setTint(0x00ff88);
    this.time.delayedCall(150, () => {
      this.tubarao.clearTint();
    });

    // Texto flutuante de pontos "+10"
    const textoPop = this.add.text(tubarao.x, tubarao.y - 30, '+10', {
      fontSize: '20px',
      fontFamily: 'Georgia, serif',
      color: '#00ff88',
      stroke: '#004422',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Anima o texto subindo e sumindo
    this.tweens.add({
      targets: textoPop,
      y: tubarao.y - 80,
      alpha: 0,
      duration: 700,
      onComplete: () => textoPop.destroy()
    });
  }

  // ============================================================
  // Callback: tubarão colidiu com concha (COLISÃO)
  // ============================================================
  levarDano(tubarao, concha) {
    // Verifica se o tubarão já está em período de invencibilidade
    if (tubarao.invencivel) return;

    // Remove a concha
    concha.destroy();

    // Reduz uma vida
    this.vidas -= 1;

    // Atualiza o display de vidas
    // Usa estrutura condicional (if) para mostrar corações restantes
    const coracoes = ['', '❤️', '❤️ ❤️', '❤️ ❤️ ❤️'];
    if (this.vidas >= 0 && this.vidas <= 3) {
      this.textoVidas.setText(coracoes[this.vidas]);
    }

    // Efeito: tubarão fica vermelho e pisca (invencibilidade temporária)
    tubarao.invencivel = true;
    tubarao.setTint(0xff3300);

    // Pisca o tubarão por 1.5 segundos
    this.tweens.add({
      targets: tubarao,
      alpha: 0.2,
      duration: 150,
      ease: 'Linear',
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        tubarao.setAlpha(1);
        tubarao.clearTint();
        tubarao.invencivel = false; // Fim da invencibilidade
      }
    });

    // Texto de dano "-vida"
    const textoDano = this.add.text(tubarao.x, tubarao.y - 30, '💥 Ai!', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#ff4400'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: textoDano,
      y: tubarao.y - 80,
      alpha: 0,
      duration: 800,
      onComplete: () => textoDano.destroy()
    });

    // Se não tem mais vidas, finaliza o jogo
    if (this.vidas <= 0) {
      this.encerrarJogo();
    }
  }

  // ============================================================
  // Encerra o jogo e vai para a cena de Game Over
  // ============================================================
  encerrarJogo() {
    this.jogoAtivo = false;

    // Para os temporizadores
    this.timerPeixinho.remove();
    this.timerConcha.remove();

    // Para a física do tubarão
    this.tubarao.setVelocity(0, 0);
    this.tubarao.setTint(0x888888);

    // Texto final antes de transicionar
    this.add.text(400, 300, 'FIM DO JOGO...', {
      fontSize: '40px',
      fontFamily: 'Georgia, serif',
      color: '#ff2200',
      stroke: '#440000',
      strokeThickness: 5
    }).setOrigin(0.5);

    // Vai para a cena de Game Over após 2 segundos, passando a pontuação
    this.time.delayedCall(2000, () => {
      this.scene.start('GameOver', { pontuacao: this.pontuacao });
    });
  }

  // ============================================================
  // UPDATE: lógica de movimento chamada a cada frame
  // ============================================================
  update() {
    if (!this.jogoAtivo) return;

    // ---- Movimento do tubarão com as setas do teclado ----
    const velocidade = this.turboAtivo ? this.velocidadeTubarao * 1.8 : this.velocidadeTubarao;

    // Reseta velocidade antes de ler inputs
    this.tubarao.setVelocity(0, 0);

    // Estrutura condicional para cada direção de movimento
    if (this.cursores.left.isDown) {
      this.tubarao.setVelocityX(-velocidade);
      this.tubarao.setFlipX(true); // Espelha horizontalmente
    } else if (this.cursores.right.isDown) {
      this.tubarao.setVelocityX(velocidade);
      this.tubarao.setFlipX(false);
    }

    if (this.cursores.up.isDown) {
      this.tubarao.setVelocityY(-velocidade);
    } else if (this.cursores.down.isDown) {
      this.tubarao.setVelocityY(velocidade);
    }

    // ---- Efeito especial TURBO (Shift) ----
    if (Phaser.Input.Keyboard.JustDown(this.teclaShift)) {
      this.ativarTurbo();
    }

    // ---- Destruir objetos que saíram da tela (otimização) ----
    // Usa estrutura de repetição para limpar peixinhos fora da tela
    this.grupoPeixinhos.getChildren().forEach(p => {
      if (p.x < -100) p.destroy();
    });

    // Limpa conchas fora da tela
    this.grupoConchas.getChildren().forEach(c => {
      if (c.x < -100) c.destroy();
    });

    // ---- Animação das bolhas decorativas ----
    for (let i = 0; i < this.bolhasJogo.length; i++) {
      this.bolhasJogo[i].obj.y -= this.bolhasJogo[i].vel;
      if (this.bolhasJogo[i].obj.y < 40) {
        this.bolhasJogo[i].obj.y = 595;
        this.bolhasJogo[i].obj.x = Phaser.Math.Between(0, 800);
      }
    }

  } // fim update()

  // ============================================================
  // Efeito especial TURBO: aumenta velocidade por 1.5 segundos
  // ============================================================
  ativarTurbo() {
    if (this.turboAtivo) return; // Não reativa se já estiver ativo

    this.turboAtivo = true;

    // Efeito visual: tint azul brilhante
    this.tubarao.setTint(0x00aaff);

    // Texto de turbo
    const textoTurbo = this.add.text(this.tubarao.x, this.tubarao.y - 40, '⚡ TURBO!', {
      fontSize: '22px',
      fontFamily: 'Georgia, serif',
      color: '#00eeff',
      stroke: '#003366',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: textoTurbo,
      y: this.tubarao.y - 90,
      alpha: 0,
      duration: 900,
      onComplete: () => textoTurbo.destroy()
    });

    // Desativa turbo após 1.5 segundos
    this.time.delayedCall(1500, () => {
      this.turboAtivo = false;
      this.tubarao.clearTint();
    });
  }

} // fim classe GameScene
