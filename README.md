# Gerador de GC interativo (controller + saída)

Gerador de GC profissional separado em dois arquivos: `controller.html` (painel) e `gc.html` (saída limpa para o OBS). Os dois se comunicam via `BroadcastChannel` e fallback em `localStorage`, funcionando tanto em `file://` quanto em GitHub Pages.

## Como usar
1. Abra `gc.html` em uma aba (ou adicione como Browser Source no OBS); ele começa oculto e com fundo transparente.
2. Abra `controller.html` em outra aba para preencher tipo de GC, título, subtítulo, escolher fundo (transparente/verde/azul), animação (slide/fade/pop) e ativar o relógio.
3. Ajuste a largura máxima do GC e defina o **limite de texto** em pixels; se o texto passar do limite, ele é comprimido automaticamente sem quebrar linha (sem quebrar em duas linhas).
4. Clique em **Mostrar GC** para exibir a arte com animação; use **Ocultar GC** para esconder e **Atualizar texto** para disparar a animação de realce do título/subtítulo.
5. As mudanças de tema, fundo, animação e relógio são enviadas em tempo real; o texto só é aplicado no `gc.html` quando você clicar em **Atualizar texto**, mantendo a animação de entrada.
