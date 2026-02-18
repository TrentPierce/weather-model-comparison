const CANDIDATE_LOCATIONS = [
    { name: "New York, US", lat: 40.7128, lon: -74.0060 },
    { name: "Los Angeles, US", lat: 34.0522, lon: -118.2437 },
    { name: "Chicago, US", lat: 41.8781, lon: -87.6298 },
    { name: "Houston, US", lat: 29.7604, lon: -95.3698 },
    { name: "Phoenix, US", lat: 33.4484, lon: -112.0740 },
    { name: "Seattle, US", lat: 47.6062, lon: -122.3321 },
    { name: "Miami, US", lat: 25.7617, lon: -80.1918 },
    { name: "Denver, US", lat: 39.7392, lon: -104.9903 },
    { name: "Boston, US", lat: 42.3601, lon: -71.0589 },
    { name: "London, UK", lat: 51.5074, lon: -0.1278 },
    { name: "Paris, FR", lat: 48.8566, lon: 2.3522 },
    { name: "Berlin, DE", lat: 52.52, lon: 13.4050 },
    { name: "Madrid, ES", lat: 40.4168, lon: -3.7038 },
    { name: "Tokyo, JP", lat: 35.6762, lon: 139.6503 },
    { name: "Seoul, KR", lat: 37.5665, lon: 126.9780 },
    { name: "Sydney, AU", lat: -33.8688, lon: 151.2093 },
    { name: "Sao Paulo, BR", lat: -23.5505, lon: -46.6333 },
    { name: "Cape Town, ZA", lat: -33.9249, lon: 18.4241 },
    { name: "Nairobi, KE", lat: -1.2921, lon: 36.8219 },
    { name: "Toronto, CA", lat: 43.6532, lon: -79.3832 }
];

const MODEL_CANDIDATES = [
    { id: "ecmwf_ifs025", label: "ECMWF IFS 0.25" },
    { id: "gfs_seamless", label: "GFS Seamless" },
    { id: "icon_seamless", label: "ICON Seamless" },
    { id: "gem_seamless", label: "GEM Seamless" },
    { id: "meteofrance_seamless", label: "Meteo-France Seamless" },
    { id: "jma_seamless", label: "JMA Seamless" },
    { id: "ukmo_seamless", label: "UKMO Seamless" },
    { id: "ecmwf_aifs025", label: "ECMWF AIFS 0.25" }
];

const WEATHER_VARS = ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"];
const LEADERBOARD_STORAGE_KEY = "weatherModelLeaderboardV1";
const COMMUNITY_LEADERBOARD_URL = window.COMMUNITY_LEADERBOARD_URL || "";

function pickRandomLocations(count) {
    const shuffled = [...CANDIDATE_LOCATIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, CANDIDATE_LOCATIONS.length));
}

function formatNum(value, decimals = 2) {
    if (!Number.isFinite(value)) return "-";
    return value.toFixed(decimals);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function parseUtcTime(timeValue) {
    if (!timeValue) return NaN;
    if (timeValue.endsWith("Z") || timeValue.includes("+")) {
        return new Date(timeValue).getTime();
    }
    return new Date(`${timeValue}Z`).getTime();
}

class ForecastComparator {
    constructor() {
        this.runBtn = document.getElementById("runBtn");
        this.locationCountInput = document.getElementById("locationCount");
        this.modelCountInput = document.getElementById("modelCount");
        this.runStatus = document.getElementById("runStatus");
        this.rankingWrap = document.getElementById("rankingWrap");
        this.leaderboardWrap = document.getElementById("leaderboardWrap");
        this.detailsWrap = document.getElementById("detailsWrap");
        this.exportLeaderboardBtn = document.getElementById("exportLeaderboardBtn");
        this.importLeaderboardBtn = document.getElementById("importLeaderboardBtn");
        this.clearLeaderboardBtn = document.getElementById("clearLeaderboardBtn");
        this.importLeaderboardFile = document.getElementById("importLeaderboardFile");
        this.runBtn.addEventListener("click", () => this.runBenchmark());
        this.exportLeaderboardBtn.addEventListener("click", () => this.exportLeaderboard());
        this.importLeaderboardBtn.addEventListener("click", () => this.importLeaderboardFile.click());
        this.clearLeaderboardBtn.addEventListener("click", () => this.clearLeaderboard());
        this.importLeaderboardFile.addEventListener("change", (event) => this.handleLeaderboardImport(event));
        this.renderPersistentLeaderboard();
    }

    setStatus(text) {
        this.runStatus.textContent = text;
    }

    async runBenchmark() {
        const locationCount = clamp(parseInt(this.locationCountInput.value, 10) || 8, 3, 20);
        const requestedModelCount = clamp(parseInt(this.modelCountInput.value, 10) || 5, 2, 8);

        this.locationCountInput.value = locationCount;
        this.modelCountInput.value = requestedModelCount;

        this.runBtn.disabled = true;
        this.setStatus("Selecting random locations and checking available models...");
        this.rankingWrap.innerHTML = '<p class="placeholder">Running benchmark...</p>';
        this.detailsWrap.innerHTML = '<p class="placeholder">Collecting location data...</p>';

        try {
            const locations = pickRandomLocations(locationCount);
            const availableModels = await this.detectAvailableModels(locations[0], requestedModelCount);

            if (availableModels.length < 2) {
                throw new Error("Not enough forecast models are currently available from the API.");
            }

            this.setStatus(`Using ${availableModels.length} models across ${locations.length} locations...`);

            const locationResults = await Promise.all(
                locations.map((location) => this.evaluateLocation(location, availableModels))
            );

            const successfulLocations = locationResults.filter((item) => !item.error);
            if (successfulLocations.length === 0) {
                throw new Error("No locations returned complete weather data.");
            }

            const ranking = this.rankModels(successfulLocations, availableModels);
            this.renderRanking(ranking, successfulLocations.length);
            this.renderDetails(successfulLocations, availableModels);
            this.updatePersistentLeaderboard(ranking);
            this.renderPersistentLeaderboard();
            await this.pushCommunityResults(ranking);

            this.setStatus(
                `Completed. Ranked ${ranking.length} models using ${successfulLocations.length} valid locations.`
            );
        } catch (error) {
            console.error(error);
            this.rankingWrap.innerHTML = `<p class="error-text">${error.message}</p>`;
            this.detailsWrap.innerHTML = '<p class="placeholder">No details available for this run.</p>';
            this.setStatus("Run failed. Check details and try again.");
        } finally {
            this.runBtn.disabled = false;
        }
    }

    async detectAvailableModels(sampleLocation, requestedCount) {
        const checks = MODEL_CANDIDATES.map(async (model) => {
            try {
                await this.fetchModelForecast(sampleLocation, model.id, new Date().toISOString());
                return model;
            } catch {
                return null;
            }
        });

        const resolved = await Promise.all(checks);
        return resolved.filter(Boolean).slice(0, requestedCount);
    }

    async evaluateLocation(location, models) {
        try {
            const observation = await this.fetchCurrentObservation(location);
            const forecastRuns = await Promise.all(
                models.map(async (model) => {
                    try {
                        const forecast = await this.fetchModelForecast(location, model.id, observation.time);
                        const score = this.calculateError(observation, forecast);
                        return {
                            modelId: model.id,
                            modelLabel: model.label,
                            forecast,
                            score
                        };
                    } catch {
                        return null;
                    }
                })
            );

            return {
                location,
                observation,
                forecasts: forecastRuns.filter(Boolean)
            };
        } catch (error) {
            return {
                location,
                error: error.message
            };
        }
    }

    async fetchCurrentObservation(location) {
        const params = new URLSearchParams({
            latitude: String(location.lat),
            longitude: String(location.lon),
            current: WEATHER_VARS.join(","),
            timezone: "UTC"
        });

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Observation request failed (${response.status})`);
        }

        const data = await response.json();
        if (!data.current) {
            throw new Error("Observation payload missing current values.");
        }

        return {
            time: data.current.time,
            temperature_2m: data.current.temperature_2m,
            relative_humidity_2m: data.current.relative_humidity_2m,
            wind_speed_10m: data.current.wind_speed_10m
        };
    }

    async fetchModelForecast(location, modelId, targetTimeIso) {
        const params = new URLSearchParams({
            latitude: String(location.lat),
            longitude: String(location.lon),
            hourly: WEATHER_VARS.join(","),
            forecast_days: "1",
            models: modelId,
            timezone: "UTC"
        });

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Forecast request failed (${response.status})`);
        }

        const data = await response.json();
        if (!data.hourly?.time?.length) {
            throw new Error("Forecast payload missing hourly series.");
        }

        const index = this.closestTimeIndex(data.hourly.time, targetTimeIso || new Date().toISOString());
        return {
            model: modelId,
            time: data.hourly.time[index],
            temperature_2m: data.hourly.temperature_2m[index],
            relative_humidity_2m: data.hourly.relative_humidity_2m[index],
            wind_speed_10m: data.hourly.wind_speed_10m[index]
        };
    }

    closestTimeIndex(timeList, targetIso) {
        if (!timeList.length) return 0;
        const target = parseUtcTime(targetIso);
        let bestIndex = 0;
        let bestDelta = Infinity;
        for (let i = 0; i < timeList.length; i += 1) {
            const timeValue = parseUtcTime(timeList[i]);
            const delta = Math.abs(timeValue - target);
            if (delta < bestDelta) {
                bestDelta = delta;
                bestIndex = i;
            }
        }
        return bestIndex;
    }

    severeEventFlags(values) {
        return {
            severeWind: values.wind_speed_10m >= 45,
            heatEvent: values.temperature_2m >= 35,
            freezeEvent: values.temperature_2m <= -2,
            highHumidity: values.relative_humidity_2m >= 90
        };
    }

    severeHitPenalty(observedFlags, forecastFlags) {
        let misses = 0;
        const keys = Object.keys(observedFlags);
        for (const key of keys) {
            if (Boolean(observedFlags[key]) !== Boolean(forecastFlags[key])) {
                misses += 1;
            }
        }
        return (misses / keys.length) * 100;
    }

    calculateError(observation, forecast) {
        const tempErr = Math.abs(forecast.temperature_2m - observation.temperature_2m);
        const humidityErr = Math.abs(
            forecast.relative_humidity_2m - observation.relative_humidity_2m
        );
        const windErr = Math.abs(forecast.wind_speed_10m - observation.wind_speed_10m);

        const observedFlags = this.severeEventFlags(observation);
        const forecastFlags = this.severeEventFlags(forecast);
        const hitPenalty = this.severeHitPenalty(observedFlags, forecastFlags);

        const overallNormalized =
            (tempErr / 15 + humidityErr / 40 + windErr / 10) / 3;
        const severeNormalized =
            (tempErr / 12 + humidityErr / 35 + windErr / 6) / 3;
        const severeComposite = (severeNormalized * 70) + (hitPenalty * 0.3);

        return {
            tempErr,
            humidityErr,
            windErr,
            hitPenalty,
            eventMatch: hitPenalty === 0,
            composite: overallNormalized * 100,
            severeComposite
        };
    }

    rankModels(locationResults, models) {
        const stats = new Map();

        for (const model of models) {
            stats.set(model.id, {
                modelId: model.id,
                modelLabel: model.label,
                samples: 0,
                totalComposite: 0,
                totalSevereComposite: 0,
                eventMatchCount: 0,
                totalTempErr: 0,
                totalHumidityErr: 0,
                totalWindErr: 0
            });
        }

        for (const result of locationResults) {
            for (const forecast of result.forecasts) {
                const entry = stats.get(forecast.modelId);
                if (!entry) continue;
                entry.samples += 1;
                entry.totalComposite += forecast.score.composite;
                entry.totalSevereComposite += forecast.score.severeComposite;
                if (forecast.score.eventMatch) {
                    entry.eventMatchCount += 1;
                }
                entry.totalTempErr += forecast.score.tempErr;
                entry.totalHumidityErr += forecast.score.humidityErr;
                entry.totalWindErr += forecast.score.windErr;
            }
        }

        const ranked = [...stats.values()]
            .filter((item) => item.samples > 0)
            .map((item) => ({
                ...item,
                avgComposite: item.totalComposite / item.samples,
                avgSevereComposite: item.totalSevereComposite / item.samples,
                eventMatchRate: (item.eventMatchCount / item.samples) * 100,
                avgTempErr: item.totalTempErr / item.samples,
                avgHumidityErr: item.totalHumidityErr / item.samples,
                avgWindErr: item.totalWindErr / item.samples
            }))
            .sort((a, b) => a.avgSevereComposite - b.avgSevereComposite);

        return ranked;
    }

    renderRanking(ranking, validLocationCount) {
        if (!ranking.length) {
            this.rankingWrap.innerHTML = '<p class="error-text">No model scores could be calculated.</p>';
            return;
        }

        let html = `
            <div class="summary-box">
                <strong>Best severe-weather model this run:</strong> ${ranking[0].modelLabel}
                <span class="meta">Lower severe score is better. Event match is how often severe/non-severe flags matched observations.</span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Model</th>
                        <th>Severe Score</th>
                        <th>Event Match %</th>
                        <th>Temp MAE (degC)</th>
                        <th>Humidity MAE (%)</th>
                        <th>Wind MAE (km/h)</th>
                        <th>Samples</th>
                    </tr>
                </thead>
                <tbody>
        `;

        ranking.forEach((row, index) => {
            const rankClass = index === 0 ? "rank-1" : "";
            html += `
                <tr>
                    <td class="${rankClass}">#${index + 1}</td>
                    <td>${row.modelLabel}</td>
                    <td>${formatNum(row.avgSevereComposite)}</td>
                    <td>${formatNum(row.eventMatchRate, 1)}</td>
                    <td>${formatNum(row.avgTempErr)}</td>
                    <td>${formatNum(row.avgHumidityErr)}</td>
                    <td>${formatNum(row.avgWindErr)}</td>
                    <td>${row.samples}/${validLocationCount}</td>
                </tr>
            `;
        });

        html += "</tbody></table>";
        this.rankingWrap.innerHTML = html;
    }

    renderDetails(locationResults, models) {
        const modelOrder = models.map((m) => m.id);

        const cards = locationResults.map((result) => {
            const forecastsByModel = new Map(result.forecasts.map((f) => [f.modelId, f]));
            let tableRows = "";

            for (const modelId of modelOrder) {
                const entry = forecastsByModel.get(modelId);
                const modelInfo = models.find((m) => m.id === modelId);

                if (!entry) {
                    tableRows += `
                        <tr>
                            <td>${modelInfo ? modelInfo.label : modelId}</td>
                            <td colspan="4" class="error-text">No forecast data</td>
                        </tr>
                    `;
                    continue;
                }

                tableRows += `
                    <tr>
                        <td>${entry.modelLabel}</td>
                        <td>${formatNum(entry.forecast.temperature_2m, 1)} (${formatNum(entry.score.tempErr, 1)})</td>
                        <td>${formatNum(entry.forecast.relative_humidity_2m, 1)} (${formatNum(entry.score.humidityErr, 1)})</td>
                        <td>${formatNum(entry.forecast.wind_speed_10m, 1)} (${formatNum(entry.score.windErr, 1)})</td>
                        <td>${formatNum(entry.score.severeComposite)}</td>
                    </tr>
                `;
            }

            return `
                <div class="location-card">
                    <h3>${result.location.name}</h3>
                    <p class="meta">Observation at ${result.observation.time} UTC: ${formatNum(result.observation.temperature_2m, 1)} degC, ${formatNum(result.observation.relative_humidity_2m, 1)}%, ${formatNum(result.observation.wind_speed_10m, 1)} km/h</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Temp (err)</th>
                                <th>Humidity (err)</th>
                                <th>Wind (err)</th>
                                <th>Severe score</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            `;
        });

        this.detailsWrap.innerHTML = cards.join("");
    }

    getPersistentLeaderboard() {
        try {
            const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    savePersistentLeaderboard(store) {
        localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(store));
    }

    exportLeaderboard() {
        const payload = {
            exportedAt: new Date().toISOString(),
            version: 1,
            data: this.getPersistentLeaderboard()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `weather-model-leaderboard-${Date.now()}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
        this.setStatus("Leaderboard exported.");
    }

    async handleLeaderboardImport(event) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            const incoming = parsed?.data && typeof parsed.data === "object" ? parsed.data : parsed;
            if (!incoming || typeof incoming !== "object") {
                throw new Error("Invalid leaderboard JSON format.");
            }
            const merged = this.mergeLeaderboards(this.getPersistentLeaderboard(), incoming);
            this.savePersistentLeaderboard(merged);
            this.renderPersistentLeaderboard();
            this.setStatus("Leaderboard imported.");
        } catch (error) {
            this.setStatus(`Import failed: ${error.message}`);
        }
    }

    mergeLeaderboards(current, incoming) {
        const result = { ...current };
        for (const [modelId, item] of Object.entries(incoming)) {
            if (!item || typeof item !== "object") continue;
            if (!result[modelId]) {
                result[modelId] = {
                    modelId,
                    modelLabel: item.modelLabel || modelId,
                    runs: 0,
                    totalSamples: 0,
                    totalSevereScore: 0,
                    totalEventMatchRate: 0
                };
            }
            const target = result[modelId];
            target.modelLabel = item.modelLabel || target.modelLabel;
            target.runs += Number(item.runs) || 0;
            target.totalSamples += Number(item.totalSamples) || 0;
            target.totalSevereScore += Number(item.totalSevereScore) || 0;
            target.totalEventMatchRate += Number(item.totalEventMatchRate) || 0;
        }
        return result;
    }

    clearLeaderboard() {
        const confirmed = window.confirm("Clear saved leaderboard data from this browser?");
        if (!confirmed) return;
        localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
        this.renderPersistentLeaderboard();
        this.setStatus("Leaderboard cleared.");
    }

    updatePersistentLeaderboard(ranking) {
        const store = this.getPersistentLeaderboard();
        for (const row of ranking) {
            if (!store[row.modelId]) {
                store[row.modelId] = {
                    modelId: row.modelId,
                    modelLabel: row.modelLabel,
                    runs: 0,
                    totalSamples: 0,
                    totalSevereScore: 0,
                    totalEventMatchRate: 0
                };
            }
            const item = store[row.modelId];
            item.modelLabel = row.modelLabel;
            item.runs += 1;
            item.totalSamples += row.samples;
            item.totalSevereScore += row.avgSevereComposite;
            item.totalEventMatchRate += row.eventMatchRate;
        }
        this.savePersistentLeaderboard(store);
    }

    getSortedPersistentLeaderboard() {
        const store = this.getPersistentLeaderboard();
        return Object.values(store)
            .map((item) => ({
                ...item,
                avgSevereScore: item.totalSevereScore / item.runs,
                avgEventMatchRate: item.totalEventMatchRate / item.runs
            }))
            .sort((a, b) => a.avgSevereScore - b.avgSevereScore);
    }

    renderPersistentLeaderboard() {
        const rows = this.getSortedPersistentLeaderboard();
        if (!rows.length) {
            this.leaderboardWrap.innerHTML = '<p class="placeholder">Run benchmarks to build your leaderboard.</p>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Model</th>
                        <th>Avg Severe Score</th>
                        <th>Avg Event Match %</th>
                        <th>Runs</th>
                        <th>Total Samples</th>
                    </tr>
                </thead>
                <tbody>
        `;

        rows.forEach((row, index) => {
            const rankClass = index === 0 ? "rank-1" : "";
            html += `
                <tr>
                    <td class="${rankClass}">#${index + 1}</td>
                    <td>${row.modelLabel}</td>
                    <td>${formatNum(row.avgSevereScore)}</td>
                    <td>${formatNum(row.avgEventMatchRate, 1)}</td>
                    <td>${row.runs}</td>
                    <td>${row.totalSamples}</td>
                </tr>
            `;
        });

        html += "</tbody></table>";
        this.leaderboardWrap.innerHTML = html;
    }

    async pushCommunityResults(ranking) {
        if (!COMMUNITY_LEADERBOARD_URL) {
            return;
        }
        try {
            await fetch(`${COMMUNITY_LEADERBOARD_URL}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    ranking
                })
            });
        } catch (error) {
            console.warn("Community leaderboard submit failed:", error);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ForecastComparator();
});
