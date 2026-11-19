# Integração de métricas — preparada, ainda desativada

Não há ID de medição nem endereço público configurado. Nenhum dado é enviado com a configuração atual. A conta e a propriedade GA4 já foram criadas pela proprietária; falta o fluxo Web.

## Ativação

1. Confirmar a hospedagem e o endereço final. O GitHub Pages estava desativado em 06/11/2026. Não publicar sem autorização da proprietária.
2. Criar um fluxo Web nessa propriedade GA4, com o endereço final. Copiar o ID `G-...` (o número da propriedade não substitui esse ID).
3. Na engrenagem de Métrica otimizada do fluxo, desativar cliques de saída, pesquisa, vídeos, downloads e formulários automáticos. Manter apenas visualizações de página e, se desejado, rolagens. Os eventos próprios abaixo medem os contatos sem enviar os destinos dos links. Essa configuração externa ainda precisa ser conferida antes da ativação.
4. Preencher `src/data/metricas.ts`: `id` e `origem` (protocolo e domínio, sem caminho ou barra final). Em GitHub Pages, a origem é `https://usuario.github.io`, mesmo se o site usar `/portifolio/`.
5. Conferir as preferências de retenção e compartilhamento da conta com a proprietária. O prazo de 180 dias no aviso refere-se apenas à escolha salva no navegador, não à retenção do Google.
6. Revisar o aviso no celular e computador. Com a configuração vazia, não há aviso nem botão novo no site. Quando ativado, aparece aviso compacto e botão “Privacidade e cookies”.
7. Rodar a montagem do site e verificar no endereço final: antes de aceitar e após recusar, nenhum evento deve ser coletado. Após aceitar, conferir no relatório em tempo real/Tag Assistant, reproduzir um vídeo, usar um filtro e clicar no contato. Recusar novamente deve bloquear novos eventos. Conferir também se não há envio automático de parâmetros pessoais em eventos da medição otimizada.

## Eventos e relatórios

| Evento | Finalidade | Parâmetros próprios |
|---|---|---|
| `page_view` (GA4) | Visitas e origem por período | URL com apenas parâmetros UTM, referência limitada à origem |
| `video_start` | Reprodução iniciada por um clique real, sem contar a prévia | `video_id`, `video_title`, `video_category` |
| `video_progress` | Cobertura de trechos assistidos, sem somar repetições ou saltos | anteriores + `video_percent` (25, 50, 75) |
| `video_complete` | Reprodução chegou ao final; não significa que todos os trechos foram vistos | identificação do vídeo |
| `category_select` | Filtro escolhido | `category` |
| `contact_click` | Intenção de contato, não contratação confirmada | `contact_channel`, `contact_position` |

Criar dimensões personalizadas com escopo de evento para os parâmetros próprios de texto, conforme os relatórios desejados. Cadastrar `contact_click` como evento principal se a proprietária quiser priorizá-lo. Comparar reproduções por `video_category` complementa os cliques nos filtros.

Os visitantes são estimativas de navegadores/identificadores. Pessoas que recusam, bloqueiam o Analytics ou desativam scripts ficam fora da coleta. A coleta só começa após ativar e aceitar; não recupera acessos anteriores. Links UTM identificam campanhas e links distribuídos, não comprovam a identidade de quem os abriu. Não usar nomes pessoais, e-mails ou dados confidenciais nos parâmetros UTM.

Ambientes locais, prévias temporárias, páginas de demonstração de temas e origens diferentes da configurada não iniciam a coleta. Não há painel administrativo dentro do portfólio.

Referências: https://developers.google.com/tag-platform/security/concepts/consent-mode e https://developers.google.com/analytics/devguides/collection/ga4/events
