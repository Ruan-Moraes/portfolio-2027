# Portfolio 2027 — Ruan Moraes

Portfólio espacial interativo de **Ruan Moraes Santos Barbosa** (Desenvolvedor Full Stack — Java, Spring Boot, C#, .NET, React, Next.js & React Native), projetado sob **Feature-Sliced Design (FSD)** estrito, **Clean Code** e **internacionalização completa (`pt-BR`, `en-US`, `es-ES`)**.

---

## ✨ Destaques Criativos & Técnicos

Inspirado na direção artística espacial de [metal-oopa/personal-portfolio](https://github.com/metal-oopa/personal-portfolio), porém reconstruído do zero em uma arquitetura moderna e livre das dívidas técnicas do template original:

1. **Starfield HTML5 `<canvas>` 60fps (`<StarfieldCanvas />`)**: Substitui os `2.000+ box-shadows` estáticos em CSS por renderização acelerada via GPU com efeito parallax suave e respeito automático a `prefers-reduced-motion`.
2. **Cubo 3D CSS (`<TechCube3D />`)**: Cubo 3D em rotação contínua destacando os 6 pilares principais da stack: **Java & Spring**, **C# & .NET**, **React & Next.js**, **React Native**, **SQL & NoSQL** e **Azure & Docker**.
3. **Esfera Fibonacci 3D Interativa (`<InteractiveSkillSphere />`)**: Nuvem 3D interativa (arraste/mouse/toque) sincronizada com filtro pelas **10 categorias oficiais do currículo**.
4. **Command Palette (`Cmd+K` / `Ctrl+K`)**: Navegação instantânea por seções, troca de idioma (`PT / EN / ES`), troca de tema (`Dark / Light` + 5 cores de destaque neon) e download direto do currículo PDF.
5. **Ambient Space Synth (`<AmbientSoundbar />`)**: Equalizador interativo `<music>` usando **Web Audio API pura** (zero arquivos MP3 pesados no bundle), iniciando pausado por padrão em respeito à UX.
6. **Cofre de Certificados Verificados (`<CertificatesVault />`)**: 13 certificações verificadas (Java, Spring Boot, React, TypeScript, Arquitetura, Segurança e Inglês) com busca textual, filtro por categoria e modal de inspeção.
7. **Mapa Interativo Dark (`<BeloHorizonteMap />`)**: Mapa Leaflet dark customizado apontando para **Belo Horizonte, MG — Brasil**, carregado sob demanda (`ssr: false`).

---

## 🏗️ Arquitetura Feature-Sliced Design (FSD)

O projeto segue a hierarquia unidirecional estrita do **Feature-Sliced Design**, auditada automaticamente via **Steiger (`pnpm lint:fsd`)**:

```text
app  ──▶  views  ──▶  widgets  ──▶  features  ──▶  entities  ──▶  shared
```

```text
src/
├── app/                          # Next.js 15 App Router ([locale], API Route ISR /api/github, Providers, CSS Global)
├── views/                        # Composição das páginas completas (compatível com Next.js sem colidir com pages/)
│   └── portfolio-home/
├── widgets/                      # Blocos autônomos da interface
│   ├── sidebar-nav/              # Sidebar espacial fixa (desktop) + dock flutuante (mobile)
│   ├── top-utility-bar/          # Barra superior com trigger Cmd+K, Soundbar, Tema e Idioma
│   ├── hero-showcase/            # Hero com AnimatedLetters, CodeTag e TechCube3D
│   ├── about-section/            # Bio executiva, métricas e perfil
│   ├── skills-sphere-section/    # Esfera 3D Fibonacci + matriz categorizada
│   ├── career-timeline/          # Experiência (CAPYS), Educação (UNINTER) e marcos
│   ├── projects-showcase/        # Case Studies arquiteturais + aba GitHub Live (ISR)
│   ├── certificates-vault/       # Galeria filtrável de 13 certificados verificados
│   ├── services-grid/            # Grid de especialidades Full Stack / Backend / DB / DevOps
│   ├── contact-map-section/      # Formulário validado + Mapa Leaflet BH
│   ├── command-palette-modal/    # Modal global Cmd+K (cmdk)
│   └── footer-section/           # Rodapé técnico
├── features/                     # Interações de usuário com estado próprio
│   ├── switch-theme/             # Dark/Light + 5 cores de destaque (Green, Purple, Blue, Orange, Red)
│   ├── switch-language/          # Seletor PT-BR / EN-US / ES-ES
│   ├── play-ambient-sound/       # Sintetizador espacial Web Audio API
│   ├── send-contact-message/     # Formulário com validação Zod + envio/fallback mailto
│   └── open-command-palette/     # Contexto e atalho global Cmd+K / Ctrl+K
├── entities/                     # Modelos de domínio e Single Sources of Truth (SSOT)
│   ├── developer-profile/        # Dados de perfil, contatos, redes e localização
│   ├── skill/                    # 10 categorias de skills e faces do cubo 3D
│   ├── career-entry/             # Histórico profissional e acadêmico
│   ├── project/                  # Case studies + cliente GitHub API
│   ├── certificate/              # 13 certificados verificados
│   └── service-offering/         # Serviços oferecidos
└── shared/                       # Primitivas reutilizáveis, i18n, tema e utilitários
    ├── config/
    ├── i18n/
    ├── lib/
    └── ui/
```

---

## 🌍 Internacionalização (i18n)

Suporte nativo e tipado a **3 idiomas** via `next-intl`:
- 🇧🇷 **Português (`pt-BR`)** — `messages/pt-BR.json`
- 🇺🇸 **Inglês (`en-US`)** — `messages/en-US.json`
- 🇪🇸 **Espanhol (`es-ES`)** — `messages/es-ES.json`

A suíte de testes (`src/shared/i18n/i18n-parity.test.ts`) garante **100% de paridade de chaves** entre os três idiomas antes de qualquer build.

---

## 🚀 Como Executar

```bash
# Instalar dependências
pnpm install

# Servidor de desenvolvimento (http://localhost:3000)
pnpm dev

# Verificar arquitetura FSD (Steiger)
pnpm lint:fsd

# Verificar tipagem TypeScript
pnpm type-check

# Executar testes automatizados (Vitest + Testing Library)
pnpm test

# Build de produção (Next.js 15 App Router)
pnpm build
```

---

## 🛠️ Manutenção Rápida (Zero Retrabalho)

- **Adicionar nova Skill**: inclua o item em `src/entities/skill/model/skill.data.ts`.
- **Adicionar novo Projeto em Destaque**: adicione os metadados em `src/entities/project/model/project.data.ts` e as traduções em `messages/{pt-BR,en-US,es-ES}.json` sob `projects.featured`.
- **Adicionar novo Certificado**: adicione o registro em `src/entities/certificate/model/certificate.data.ts` e os textos em `messages/{pt-BR,en-US,es-ES}.json` sob `certificates.items`.
