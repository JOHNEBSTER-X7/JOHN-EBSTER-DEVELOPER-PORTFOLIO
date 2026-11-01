from __future__ import annotations

import os
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

app = FastAPI(
    title="Market Intelligence API",
    version="1.0.0",
    description="A demonstrator API that normalises illustrative market signals and ranks them using transparent rules.",
)


class Signal(BaseModel):
    id: str
    title: str
    source: str
    category: Literal["software", "ai", "fintech", "web3", "ecommerce", "other"]
    summary: str
    demand_mentions: int = Field(ge=0)
    urgency: int = Field(ge=1, le=5)
    competition: int = Field(ge=1, le=5)
    created_at: str


class SignalResult(Signal):
    score: float
    score_explanation: str


# Synthetic sample data for local demonstration only; not live market research.
SIGNALS: list[Signal] = [
    Signal(id="sig-001", title="Automated invoice reconciliation for small firms",
           source="Demo dataset", category="fintech",
           summary="Small businesses need to match invoices, payments and bank transactions.",
           demand_mentions=42, urgency=4, competition=2, created_at="2026-10-28"),
    Signal(id="sig-002", title="AI knowledge assistant for internal documents",
           source="Demo dataset", category="ai",
           summary="Teams want searchable answers grounded in their own policies and files.",
           demand_mentions=58, urgency=5, competition=4, created_at="2026-10-29"),
    Signal(id="sig-003", title="Supplier catalogue normalisation API",
           source="Demo dataset", category="ecommerce",
           summary="Retailers need to clean inconsistent product feeds and attributes.",
           demand_mentions=31, urgency=3, competition=2, created_at="2026-10-30"),
    Signal(id="sig-004", title="Multisig treasury operations dashboard",
           source="Demo dataset", category="web3",
           summary="DAO operators need visibility into approvals, pending transactions and policies.",
           demand_mentions=24, urgency=4, competition=3, created_at="2026-10-31"),
]


def score_signal(signal: Signal) -> tuple[float, str]:
    """Return a transparent 0-100 heuristic score, not a predictive market model."""
    demand = min(signal.demand_mentions / 60, 1) * 40
    urgency = (signal.urgency / 5) * 30
    whitespace = ((6 - signal.competition) / 5) * 30
    score = round(demand + urgency + whitespace, 1)
    explanation = (
        f"Demand contributes {demand:.1f}/40, urgency {urgency:.1f}/30, "
        f"and lower competition contributes {whitespace:.1f}/30."
    )
    return score, explanation


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "market-intelligence-api"}


@app.get("/signals", response_model=list[SignalResult])
def list_signals(
    category: str | None = Query(default=None),
    min_score: float = Query(default=0, ge=0, le=100),
) -> list[SignalResult]:
    if category and category not in {"software", "ai", "fintech", "web3", "ecommerce", "other"}:
        raise HTTPException(status_code=400, detail="Unsupported category")
    results: list[SignalResult] = []
    for signal in SIGNALS:
        if category and signal.category != category:
            continue
        score, explanation = score_signal(signal)
        if score >= min_score:
            results.append(
                SignalResult(**signal.model_dump(), score=score, score_explanation=explanation)
            )
    return sorted(results, key=lambda item: item.score, reverse=True)


@app.get("/signals/{signal_id}", response_model=SignalResult)
def get_signal(signal_id: str) -> SignalResult:
    signal = next((item for item in SIGNALS if item.id == signal_id), None)
    if signal is None:
        raise HTTPException(status_code=404, detail="Signal not found")
    score, explanation = score_signal(signal)
    return SignalResult(**signal.model_dump(), score=score, score_explanation=explanation)


@app.post("/signals/{signal_id}/summary")
def summarise_signal(signal_id: str) -> dict[str, str]:
    """Optional OpenAI summary. Without a key, returns a transparent local summary."""
    signal = next((item for item in SIGNALS if item.id == signal_id), None)
    if signal is None:
        raise HTTPException(status_code=404, detail="Signal not found")

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {
            "mode": "local-fallback",
            "summary": f"{signal.title}: {signal.summary} This is a demo signal, not independently verified demand."
        }

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            input=(
                "Summarise this market signal in 3 concise sentences. "
                "Distinguish observed information from assumptions. Do not invent evidence.\n"
                f"Title: {signal.title}\nCategory: {signal.category}\n"
                f"Description: {signal.summary}\nMentions: {signal.demand_mentions}"
            ),
        )
        return {"mode": "openai", "summary": response.output_text}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM request failed: {type(exc).__name__}") from exc
