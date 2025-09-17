# GreenPulse

<p align="center">
  <img src="src/assets/voltera-logo.png" alt="GreenPulse Logo" width="120" />
</p>

<p align="center">
  <b>Monitoramento inteligente de energia, recursos e saúde operacional para ambientes críticos.</b>
</p>

<p align="center">
  <a href="https://github.com/Samurai33/GreenPulse" target="_blank"><img src="https://img.shields.io/github/stars/Samurai33/GreenPulse?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/Samurai33/GreenPulse" target="_blank"><img src="https://img.shields.io/github/forks/Samurai33/GreenPulse?style=social" alt="GitHub forks"></a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/github/license/Samurai33/GreenPulse?color=blue" alt="MIT License">
</p>

---

## ✨ Diferenciais

- Visualização em tempo real de KPIs críticos (Energia, Carbono, SRE, Marketplace)
- Alertas inteligentes e personalizáveis (críticos, warning, info)
- Interface responsiva e moderna (React + Tailwind)
- Simulação de dados para testes e demonstrações
- Exportação de relatórios em CSV/JSON/PDF
- Arquitetura escalável e modular
- Marketplace de recursos computacionais
- Monitoramento de saúde operacional (Golden Signals, hardware, incidentes)

## 📷 Exemplos Visuais

<p align="center">
  <img src="src/assets/exemple1.png" alt="Exemplo 1" width="320" />
  <img src="src/assets/exemple2.png" alt="Exemplo 2" width="320" />
  <img src="src/assets/exemple3.png" alt="Exemplo 3" width="320" />
  <img src="src/assets/exemple4.png" alt="Exemplo 4" width="320" />
</p>

## 🚀 Tecnologias & Dependências

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (componentes UI)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [TanStack Query](https://tanstack.com/query)
- [Recharts](https://recharts.org/)
- [date-fns](https://date-fns.org/)
- [ESLint](https://eslint.org/)

## 📦 Instalação

```sh
# Clone o repositório
$ git clone https://github.com/Samurai33/GreenPulse.git
$ cd GreenPulse
$ npm install
```

## 🏃‍♂️ Uso em Desenvolvimento

```sh
npm run dev
```
Acesse: http://localhost:5173

## 🏗️ Build para Produção

```sh
npm run build
npm run preview
```
Acesse: http://localhost:4173

## 🛠️ Scripts

- `npm run dev`: Inicia ambiente de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run preview`: Preview do build
- `npm run lint`: Executa análise de código

## 📂 Estrutura Real do Projeto

```
GreenPulse/
├── bun.lockb
├── components.json
├── data/
│   ├── alerts.json
│   ├── energy_timeseries.json
│   ├── marketplace.json
│   └── sre_metrics.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── README.md
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── assets/
│   │   ├── exemple1.png
│   │   ├── exemple2.png
│   │   ├── exemple3.png
│   │   ├── exemplo4.png
│   │   └── voltera-logo.png
│   ├── components/
│   │   ├── alerts/
│   │   │   └── alerts-table.tsx
│   │   ├── charts/
│   │   │   ├── energy-area-chart.tsx
│   │   │   └── pue-gauge.tsx
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx
│   │   │   └── dashboard-layout.tsx
│   │   └── ui/
│   │      └── [diversos componentes UI]
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── index.css
│   ├── lib/
│   │   ├── kpis.ts
│   │   └── utils.ts
│   ├── main.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Energia.tsx
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   ├── Recursos.tsx
│   │   ├── Relatorios.tsx
│   │   └── Saude.tsx
│   └── vite-env.d.ts
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🧩 Principais Funcionalidades

- **Dashboard**: Visão geral dos KPIs, alertas recentes, status operacional
- **Energia & Carbono**: Gráficos de consumo, geração solar, PUE, créditos de carbono
- **Recursos**: Marketplace de ofertas de CPU, GPU, Storage, jobs em execução
- **Saúde do Servidor**: Golden Signals SRE, status de hardware, incidentes, uptime, MTBF/MTTR
- **Relatórios**: Exportação de dados, geração de snapshots, filtros por período e formato
- **Alertas**: Sistema de alertas críticos, warning e informativos, com ações sugeridas
- **Simulação de Dados**: Arquivos JSON para testes e demonstrações

## 📊 Exemplos de Dados Simulados

- `data/alerts.json`: Alertas críticos, warning e info (ex: falha solar, S.M.A.R.T. disk, latência)
- `data/energy_timeseries.json`: Consumo horário, geração solar, PUE diário
- `data/sre_metrics.json`: Golden Signals, hardware, incidentes, uptime, MTBF/MTTR
- `data/marketplace.json`: Ofertas de recursos, jobs, status e preços

## 🧱 Componentes UI

- Botões, cards, tabelas, gráficos, badges, menus, sidebar, toast, dialog, etc. (baseados em shadcn/ui e Radix)
- Hooks customizados: `useIsMobile`, `useToast`
- Utilitários: `lib/kpis.ts` (cálculo de PUE, CO2, créditos), `lib/utils.ts` (classes CSS)

## 🗂️ Páginas

- `Dashboard.tsx`: KPIs, alertas, status geral
- `Energia.tsx`: Gráficos de energia, PUE, créditos de carbono
- `Recursos.tsx`: Marketplace de recursos, ofertas, jobs
- `Saude.tsx`: Golden Signals, hardware, incidentes, uptime
- `Relatorios.tsx`: Exportação de dados, snapshots, disclaimers
- `NotFound.tsx`: Página 404 customizada

## 🧪 Testes & Qualidade

- ESLint configurado para TypeScript e React
- Scripts de lint disponíveis (`npm run lint`)
- Recomenda-se uso de testes unitários para funções críticas (ex: KPIs)

## 🚀 Deploy

- Build otimizado via Vite
- Preview local: `npm run preview`
- Deploy rápido via [Lovable](https://lovable.dev/projects/50c738ce-1a80-4611-b3fe-2bd49f703818)
- Suporte a domínio customizado ([docs](https://docs.lovable.dev/features/custom-domain#custom-domain))

## 🤝 Contribuição

Pull requests são bem-vindos! Siga o padrão de código, escreva testes e descreva claramente suas mudanças.

1. Fork este repositório
2. Crie uma branch (`git checkout -b feature/nome-feature`)
3. Commit suas alterações (`git commit -am 'feat: minha feature'`)
4. Push para a branch (`git push origin feature/nome-feature`)
5. Abra um Pull Request

## 📑 Licença

MIT © Samurai33

## 📬 Contato & Links Úteis

- [samurai33@github.com](mailto:samurai33@github.com)
- [Documentação React](https://react.dev/)
- [Documentação Vite](https://vitejs.dev/)
- [Documentação TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lovable Deploy](https://lovable.dev/)

---

> **Este projeto é uma demonstração didática. Dados simulados e relatórios não substituem auditorias profissionais. Para uso oficial, consulte inventários certificados e normas técnicas.**
