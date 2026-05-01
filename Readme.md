# AI-Native Development Platforms and Traditional IDEs: Impact of Agentic AI on Software Engineering

**Roll No:** 2210991642
**Name:** Harshita
**Team:** Team 2
**University:** Chitkara University, Punjab
**Course:** CO-OP Project at Industry (Module-2)
**Status:** Paper submitted to Microsoft CMT for publishing (IEEE Conference)

---

## Repository Structure

```
AI-Native-vs-Traditional-IDEs (2210991642)/
│
├── research-paper/
│   └── Team_2_06-04-2026_Research_Paper_Harshita.docx
│
├── benchmark-projects/
│   ├── todo-list/          # W1, W2, W3 builds of the Todo List app
│   └── e-commerce/         # W1, W2, W3 builds of the E-Commerce site
│
├── logs/
│   ├── cli-logs/           # Terminal session logs (timestamped)
│   └── agentic-traces/     # Claude API trace logs (prompt → tool call → recovery)
│
└── README.md
```

---

## Research Overview

This paper presents the **first controlled, instrumented comparison** of three software development workflows on identical benchmark projects:

| Workflow | Tool | Description |
|---|---|---|
| **W1** | VS Code (Manual) | All code written by hand — control baseline |
| **W2** | GitHub Copilot | AI-assisted suggestions; developer owns architecture |
| **W3** | Claude (Agentic) | Fully agentic; natural language prompts only |

Two projects were built across all three workflows:
- **Todo List App** — Basic CRUD, localStorage, responsive UI
- **E-Commerce Site** — Product catalog, cart, checkout, Supabase, JWT auth, RBAC

All runs were performed on the **same hardware** (Intel Core i5, 16 GB RAM, Fedora Linux, Node.js v24.14.0 LTS). CLI sessions were logged and W3 sessions were screen-recorded for objective trace evidence.

---

## Key Findings

### Aggregate Results (Both Projects Combined)

| Metric | W1 Manual | W2 Copilot | W3 Claude | W3 vs W1 |
|---|---|---|---|---|
| Time-to-MVP (hrs) | 7.88 | 3.55 | **2.84** | −64% |
| LOC / hr | 93.5 | 205.5 | **~949** | +915% |
| Debug Cycles | 6.0 | 3.5 | **2.5** | −58% |
| Bug Density (/100 LOC) | 2.0 | 1.2 | **0.25** | −88% |
| Verification Overhead | 12.5% | 23% | **~37.5%** | +200% |

### Notable Findings
- W3 reduced **time-to-MVP by 64%** and **bug density by 88%** vs. manual baseline
- W3 code throughput of **~949 LOC/hr** — a 915% increase over manual
- Verification overhead (~37.5%) was driven primarily by **environment-level issues** (OS inotify limits, API misconfigs), not code failures — confirmed via CLI log timestamps
- Zero defects found in Todo List W3 run on structured review checklist

---

## Hybrid Orchestration Framework (HOF)

A key contribution of this paper — three developer roles that emerge in agentic workflows:

| Role | Responsibility |
|---|---|
| **Prompt Architect** | Designs and maintains the Standardized Prompting Protocol (SPP); directly determines output quality |
| **Agentic Trace Auditor** | Reads CLI and trace logs to verify correctness and attribute overhead causes |
| **System Orchestrator** | Ensures independently generated components integrate correctly; makes upstream architecture decisions |

---

## Workflow Recommendation Matrix

| Context | Recommended | Rationale |
|---|---|---|
| Rapid prototyping / hackathon | W3 (Claude) | Speed is primary; defect tolerance is high |
| Solo developer, standard app | W2 (Copilot) | Balance of speed and hands-on control |
| Security-critical system | W1 (Manual) | Full developer accountability required |
| Enterprise team, mod. complexity | W2 + HOF roles | Structured AI use with governance |
| Learning / educational context | W1 then W2 | Comprehension before delegation |

---

## Technologies Used

- Claude (Anthropic API + CLI) — W3 agentic workflow
- GitHub Copilot (VS Code extension) — W2 assisted workflow
- Next.js 14, Tailwind CSS, Node.js v24 LTS
- Supabase (E-Commerce backend), JWT, RBAC
- Fedora Linux, unixODBC, CLI session logging

---

## Paper Status

Submitted to **Microsoft CMT** for IEEE conference publishing.
Authors: Harshita (2210991642), Team 2, Chitkara University

---

## Collaborator Access

This repository has been shared with: **cse.ph4e@chitkara.edu.in**
