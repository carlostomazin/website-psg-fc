import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Player {
  name: string;
  is_goalkeeper: boolean;
  is_visitor: boolean;
  invited_by_name: string | null;
}

export interface TeamPlayer {
  name: string
  is_goalkeeper?: boolean
}

export interface GeneratedTeam {
  name: string
  players: TeamPlayer[]
}

export interface GeneratedTeamsResult {
  teams: GeneratedTeam[]
  goalkeepers: TeamPlayer[]
}

export function generateTeams(players: TeamPlayer[], teamCount = 3): GeneratedTeamsResult {
  const goalkeepers = players.filter((player) => player.is_goalkeeper)
  const fieldPlayers = players.filter((player) => !player.is_goalkeeper)

  const shuffledPlayers = [...fieldPlayers].sort(() => Math.random() - 0.5)
  const teams = Array.from({ length: teamCount }, (_, index) => ({
    name: `Time ${index + 1}`,
    players: [] as TeamPlayer[],
  }))

  const teamSizes = Array.from({ length: teamCount }, () => 0)

  shuffledPlayers.forEach((player) => {
    let targetTeamIndex = 0
    let smallestSize = Number.POSITIVE_INFINITY

    teamSizes.forEach((size, index) => {
      if (size < smallestSize) {
        smallestSize = size
        targetTeamIndex = index
      }
    })

    teams[targetTeamIndex].players.push(player)
    teamSizes[targetTeamIndex] += 1
  })

  return {
    teams,
    goalkeepers,
  }
}

export function parseListaFutebol(texto: string): Player[] {
const listaFinal: Player[] = [];
  
  // 1. Remove emojis e caracteres invisíveis de formatação do WhatsApp
  const textoLimpo = texto
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F200}-\u{1F2FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove caracteres invisíveis

  // 2. Divide em seções
  const secoes = textoLimpo.split(/(GOLEIROS|DA CASA|VISITANTES|NÃO VÃO)/i);
  let secaoAtual = "";

  for (let i = 0; i < secoes.length; i++) {
    const bloco = secoes[i].trim().toUpperCase();

    if (["GOLEIROS", "DA CASA", "VISITANTES", "NÃO VÃO"].includes(bloco)) {
      secaoAtual = bloco;
      continue;
    }

    if (secaoAtual === "NÃO VÃO" || secaoAtual === "") continue;

    const linhas = secoes[i].split('\n');

    linhas.forEach(linha => {
      // REGRA CRUCIAL: Só processa se a linha começar com número e ponto (ex: "1. ")
      // Isso ignora avisos como "Segunda, abrimos vaga..."
      const matchLinhaValida = linha.trim().match(/^\d+\.\s*(.+)/);
      
      if (matchLinhaValida) {
        const conteudoJogador = matchLinhaValida[1].trim();

        // Ignora linhas que só tem o número mas estão vazias (ex: "16.")
        if (!conteudoJogador || conteudoJogador === "") return;

        // Regex para capturar Nome e Convidado
        const matchNome = conteudoJogador.match(/^([^(]+)(?:\(([^)]+)\))?/);

        if (matchNome) {
          const nomePrincipal = matchNome[1].trim();
          const convidadoPor = matchNome[2] ? matchNome[2].trim() : null;

          listaFinal.push({
            name: nomePrincipal,
            is_goalkeeper: secaoAtual === "GOLEIROS",
            is_visitor: convidadoPor !== null || secaoAtual === "VISITANTES",
            invited_by_name: convidadoPor
          });
        }
      }
    });
  }

  return listaFinal;
}