"""
QuestMe — YouTube Shorts direct-stream extraction API.

Uses yt-dlp to extract direct playable video URLs from YouTube Shorts,
bypassing the need for WebView embeds on the client.
"""

import asyncio
import hashlib
import time
from functools import lru_cache
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter(prefix="/shorts", tags=["shorts"])


# ---------------------------------------------------------------------------
# In-memory cache for extracted URLs (TTL-based)
# ---------------------------------------------------------------------------

_stream_cache: dict[str, tuple[dict, float]] = {}
_CACHE_TTL_SECONDS = 3600  # YouTube stream URLs typically expire in ~6 hours


def _cache_key(video_id: str, quality: str) -> str:
    return hashlib.md5(f"{video_id}:{quality}".encode()).hexdigest()


def _get_cached(video_id: str, quality: str) -> Optional[dict]:
    key = _cache_key(video_id, quality)
    entry = _stream_cache.get(key)
    if entry is None:
        return None
    data, timestamp = entry
    if time.time() - timestamp > _CACHE_TTL_SECONDS:
        _stream_cache.pop(key, None)
        return None
    return data


def _set_cached(video_id: str, quality: str, data: dict) -> None:
    key = _cache_key(video_id, quality)
    _stream_cache[key] = (data, time.time())
    # Evict old entries if cache grows too large
    if len(_stream_cache) > 500:
        now = time.time()
        expired = [k for k, (_, ts) in _stream_cache.items() if now - ts > _CACHE_TTL_SECONDS]
        for k in expired:
            _stream_cache.pop(k, None)


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------

class StreamInfo(BaseModel):
    video_id: str
    title: str
    channel: str
    description: str
    thumbnail: str
    duration: Optional[int] = None
    view_count: Optional[int] = None
    like_count: Optional[int] = None
    stream_url: str
    audio_url: Optional[str] = None
    quality: str
    width: Optional[int] = None
    height: Optional[int] = None
    expires_at: Optional[int] = None


class BatchStreamResponse(BaseModel):
    streams: list[StreamInfo]
    errors: list[dict] = []


# ---------------------------------------------------------------------------
# yt-dlp extraction
# ---------------------------------------------------------------------------

def _extract_stream_sync(video_id: str, quality: str = "best") -> dict:
    """
    Extract direct stream URL for a YouTube video using yt-dlp.
    Runs synchronously — to be called in a thread pool from async context.
    """
    try:
        from yt_dlp import YoutubeDL
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="yt-dlp is not installed. Run: pip install yt-dlp",
        )

    url = f"https://www.youtube.com/shorts/{video_id}"

    # Pick format based on quality preference
    if quality == "audio":
        fmt = "bestaudio[ext=m4a]/bestaudio"
    elif quality == "low":
        fmt = "best[height<=480][ext=mp4]/best[height<=480]/best"
    elif quality == "medium":
        fmt = "best[height<=720][ext=mp4]/best[height<=720]/best"
    elif quality == "high":
        fmt = "best[height<=1080][ext=mp4]/best[height<=1080]/best"
    else:  # "best"
        fmt = "best[ext=mp4]/best"

    ydl_opts = {
        "format": fmt,
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "no_check_certificates": True,
        "socket_timeout": 15,
        "extract_flat": False,
        # Avoid geo-restrictions on some Shorts
        "geo_bypass": True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    if not info:
        raise HTTPException(status_code=404, detail=f"Could not extract info for {video_id}")

    stream_url = info.get("url", "")
    if not stream_url:
        # Try to get from requested_formats (when format merging is needed)
        formats = info.get("requested_formats") or []
        video_fmt = next((f for f in formats if f.get("vcodec", "none") != "none"), None)
        audio_fmt = next((f for f in formats if f.get("acodec", "none") != "none"), None)
        stream_url = (video_fmt or {}).get("url", info.get("url", ""))
        audio_url = (audio_fmt or {}).get("url") if audio_fmt else None
    else:
        audio_url = None

    # Parse expiry from stream URL (Google CDN URLs contain &expire=TIMESTAMP)
    expires_at = None
    if "expire=" in stream_url:
        try:
            expire_param = stream_url.split("expire=")[1].split("&")[0]
            expires_at = int(expire_param)
        except (ValueError, IndexError):
            pass

    return {
        "video_id": video_id,
        "title": info.get("title", "YouTube Short"),
        "channel": info.get("channel", info.get("uploader", "Unknown")),
        "description": info.get("description", "")[:300],
        "thumbnail": (
            info.get("thumbnail")
            or f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
        ),
        "duration": info.get("duration"),
        "view_count": info.get("view_count"),
        "like_count": info.get("like_count"),
        "stream_url": stream_url,
        "audio_url": audio_url,
        "quality": quality,
        "width": info.get("width"),
        "height": info.get("height"),
        "expires_at": expires_at,
    }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/stream/{video_id}", response_model=StreamInfo)
async def get_stream(
    video_id: str,
    quality: str = Query("best", regex="^(best|high|medium|low|audio)$"),
):
    """
    Extract a direct playable stream URL for a YouTube Short.
    The returned URL can be used directly in a native video player.
    """
    # Check cache first
    cached = _get_cached(video_id, quality)
    if cached:
        return StreamInfo(**cached)

    # Run yt-dlp in a thread pool (it's CPU/IO-bound)
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, _extract_stream_sync, video_id, quality)

    _set_cached(video_id, quality, result)
    return StreamInfo(**result)


@router.post("/batch", response_model=BatchStreamResponse)
async def batch_streams(
    video_ids: list[str],
    quality: str = Query("best", regex="^(best|high|medium|low|audio)$"),
):
    """
    Extract direct stream URLs for multiple YouTube Shorts in parallel.
    Max 10 video IDs per request.
    """
    if len(video_ids) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 video IDs per batch request.")

    if not video_ids:
        raise HTTPException(status_code=400, detail="At least one video ID is required.")

    loop = asyncio.get_running_loop()
    streams: list[StreamInfo] = []
    errors: list[dict] = []

    async def extract_one(vid: str):
        # Check cache first
        cached = _get_cached(vid, quality)
        if cached:
            streams.append(StreamInfo(**cached))
            return

        try:
            result = await loop.run_in_executor(None, _extract_stream_sync, vid, quality)
            _set_cached(vid, quality, result)
            streams.append(StreamInfo(**result))
        except Exception as e:
            errors.append({"video_id": vid, "error": str(e)})

    await asyncio.gather(*(extract_one(vid) for vid in video_ids))

    return BatchStreamResponse(streams=streams, errors=errors)


@router.get("/search", response_model=BatchStreamResponse)
async def search_and_extract(
    q: str = Query("#shorts quest challenge", description="Search query for YouTube Shorts"),
    max_results: int = Query(6, ge=1, le=20),
    quality: str = Query("best", regex="^(best|high|medium|low|audio)$"),
):
    """
    Search YouTube for Shorts matching a query, then extract direct stream URLs.
    Combines YouTube Data API search with yt-dlp extraction.
    """
    try:
        from yt_dlp import YoutubeDL
    except ImportError:
        raise HTTPException(status_code=503, detail="yt-dlp is not installed.")

    # Use yt-dlp's built-in YouTube search to find shorts
    search_url = f"ytsearch{max_results}:{q} #shorts"

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "extract_flat": True,
        "no_check_certificates": True,
    }

    loop = asyncio.get_running_loop()

    def do_search():
        with YoutubeDL(ydl_opts) as ydl:
            return ydl.extract_info(search_url, download=False)

    search_result = await loop.run_in_executor(None, do_search)
    entries = search_result.get("entries") or [] if search_result else []

    video_ids = [
        entry.get("id") for entry in entries
        if entry.get("id") and entry.get("duration", 61) <= 60
    ][:max_results]

    if not video_ids:
        # Fallback: take all results even if duration is unknown
        video_ids = [
            entry.get("id") for entry in entries if entry.get("id")
        ][:max_results]

    streams: list[StreamInfo] = []
    errors: list[dict] = []

    async def extract_one(vid: str):
        cached = _get_cached(vid, quality)
        if cached:
            streams.append(StreamInfo(**cached))
            return
        try:
            result = await loop.run_in_executor(None, _extract_stream_sync, vid, quality)
            _set_cached(vid, quality, result)
            streams.append(StreamInfo(**result))
        except Exception as e:
            errors.append({"video_id": vid, "error": str(e)})

    await asyncio.gather(*(extract_one(vid) for vid in video_ids))

    return BatchStreamResponse(streams=streams, errors=errors)
