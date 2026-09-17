import { useEffect, useMemo, useState } from "react";

const currencies = [
  {
    code: "USD",
    name: "US Dollar",
    country: "United States",
    flag: "🇺🇸",
    symbol: "$",
  },
  {
    code: "PKR",
    name: "Pakistani Rupee",
    country: "Pakistan",
    flag: "🇵🇰",
    symbol: "₨",
  },
  {
    code: "EUR",
    name: "Euro",
    country: "European Union",
    flag: "🇪🇺",
    symbol: "€",
  },
  {
    code: "GBP",
    name: "British Pound",
    country: "United Kingdom",
    flag: "🇬🇧",
    symbol: "£",
  },
  {
    code: "AED",
    name: "UAE Dirham",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    symbol: "د.إ",
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    symbol: "﷼",
  },
  {
    code: "INR",
    name: "Indian Rupee",
    country: "India",
    flag: "🇮🇳",
    symbol: "₹",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    country: "China",
    flag: "🇨🇳",
    symbol: "¥",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    country: "Japan",
    flag: "🇯🇵",
    symbol: "¥",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    country: "Canada",
    flag: "🇨🇦",
    symbol: "$",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    country: "Australia",
    flag: "🇦🇺",
    symbol: "$",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    country: "Switzerland",
    flag: "🇨🇭",
    symbol: "CHF",
  },
  {
    code: "TRY",
    name: "Turkish Lira",
    country: "Turkey",
    flag: "🇹🇷",
    symbol: "₺",
  },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
    country: "Malaysia",
    flag: "🇲🇾",
    symbol: "RM",
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    country: "Singapore",
    flag: "🇸🇬",
    symbol: "$",
  },
  {
    code: "NZD",
    name: "New Zealand Dollar",
    country: "New Zealand",
    flag: "🇳🇿",
    symbol: "$",
  },
  {
    code: "NOK",
    name: "Norwegian Krone",
    country: "Norway",
    flag: "🇳🇴",
    symbol: "kr",
  },
  {
    code: "SEK",
    name: "Swedish Krona",
    country: "Sweden",
    flag: "🇸🇪",
    symbol: "kr",
  },
  {
    code: "DKK",
    name: "Danish Krone",
    country: "Denmark",
    flag: "🇩🇰",
    symbol: "kr",
  },
  {
    code: "ZAR",
    name: "South African Rand",
    country: "South Africa",
    flag: "🇿🇦",
    symbol: "R",
  },
  {
    code: "BRL",
    name: "Brazilian Real",
    country: "Brazil",
    flag: "🇧🇷",
    symbol: "R$",
  },
];

const popularCurrencies = [
  "USD",
  "PKR",
  "EUR",
  "GBP",
  "AED",
  "SAR",
  "INR",
  "CAD",
];

function getCurrency(code) {
  return currencies.find(
    (currency) => currency.code === code
  );
}

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(number);
}

function App() {
  const [fromCurrency, setFromCurrency] =
    useState("USD");

  const [toCurrency, setToCurrency] =
    useState("PKR");

  const [amount, setAmount] =
    useState("1");

  const [rate, setRate] =
    useState(null);

  const [apiDate, setApiDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [convertedResult, setConvertedResult] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const selectedFrom =
    getCurrency(fromCurrency);

  const selectedTo =
    getCurrency(toCurrency);

  const filteredCurrencies =
    currencies.filter((currency) => {
      const query =
        search.toLowerCase().trim();

      return (
        currency.name
          .toLowerCase()
          .includes(query) ||
        currency.code
          .toLowerCase()
          .includes(query) ||
        currency.country
          .toLowerCase()
          .includes(query)
      );
    });

  const calculatedResult = useMemo(() => {
    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount < 0
    ) {
      return 0;
    }

    if (
      fromCurrency ===
      toCurrency
    ) {
      return numericAmount;
    }

    if (rate === null) {
      return 0;
    }

    return numericAmount * rate;
  }, [
    amount,
    fromCurrency,
    toCurrency,
    rate,
  ]);

  const fetchRate = async () => {
    setLoading(true);
    setError("");

    try {
      if (
        fromCurrency ===
        toCurrency
      ) {
        setRate(1);

        setApiDate(
          new Date()
            .toISOString()
            .split("T")[0]
        );

        return 1;
      }

      const response =
        await fetch(
          `https://api.frankfurter.dev/v2/rate/${fromCurrency.toLowerCase()}/${toCurrency.toLowerCase()}`
        );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch exchange rate."
        );
      }

      const data =
        await response.json();

      if (!data.rate) {
        throw new Error(
          "Exchange rate is not available."
        );
      }

      const currentRate =
        Number(data.rate);

      setRate(currentRate);

      setApiDate(
        data.date || ""
      );

      return currentRate;
    } catch (err) {
      setRate(null);
      setApiDate("");

      setError(
        err.message ||
          "Something went wrong."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setConvertedResult(null);
    fetchRate();
  }, [
    fromCurrency,
    toCurrency,
  ]);

  const handleConvert =
    async () => {
      if (
        amount === "" ||
        Number(amount) < 0 ||
        !Number.isFinite(
          Number(amount)
        )
      ) {
        setError(
          "Please enter a valid amount."
        );

        return;
      }

      setError("");

      const currentRate =
        await fetchRate();

      if (currentRate === null) {
        return;
      }

      const numericAmount =
        Number(amount);

      const result =
        numericAmount *
        currentRate;

      setConvertedResult(
        result
      );

      const historyItem = {
        id: Date.now(),
        amount: numericAmount,
        from: fromCurrency,
        to: toCurrency,
        rate: currentRate,
        result,
        date: new Date().toLocaleString(),
      };

      setHistory(
        (previous) => [
          historyItem,
          ...previous,
        ].slice(0, 8)
      );
    };

  const handleSwap =
    () => {
      const oldFrom =
        fromCurrency;

      setFromCurrency(
        toCurrency
      );

      setToCurrency(
        oldFrom
      );

      setConvertedResult(
        null
      );

      setError("");
    };

  const handlePopularCurrency =
    (code) => {
      setToCurrency(code);
      setConvertedResult(
        null
      );
      setError("");

      if (
        code === fromCurrency
      ) {
        setFromCurrency("USD");
      }
    };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">

        <div className="mx-auto flex h-20 w-[92%] max-w-7xl items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-black shadow-lg shadow-blue-500/20">
              C
            </div>

            <div>
              <h1 className="text-lg font-bold">
                CurrencyFlow
              </h1>

              <p className="text-[11px] text-slate-400">
                Smart Currency Converter
              </p>
            </div>

          </div>

          <div className="hidden items-center gap-2 text-xs text-slate-300 sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60"></span>

            Latest Available Rates
          </div>

        </div>

      </header>

      <main className="mx-auto w-[92%] max-w-7xl py-12 sm:py-16">

        {/* HERO */}

        <section className="mb-9">

          <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-[10px] font-bold tracking-[0.15em] text-blue-300">
            LIVE RATE LOOKUP
          </span>

          <h2 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Convert currencies
            <span className="text-blue-400">
              {" "}instantly.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Convert money between currencies
            from different countries using
            the latest available exchange rates.
          </p>

        </section>

        {/* MAIN CONVERTER */}

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/95 p-5 shadow-2xl shadow-black/30 sm:p-7">

          {/* CARD HEADER */}

          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h3 className="text-xl font-bold">
                Currency Converter
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Choose currencies and enter an amount.
              </p>
            </div>

            <button
              onClick={fetchRate}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-blue-400/40 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Refreshing..."
                : "↻ Refresh Rate"}
            </button>

          </div>

          {/* INPUT GRID */}

          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[1fr_56px_1fr]">

            {/* FROM */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-400">
                From
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">

                <span className="text-2xl">
                  {selectedFrom.flag}
                </span>

                <select
                  value={fromCurrency}
                  onChange={(e) => {
                    setFromCurrency(
                      e.target.value
                    );

                    setConvertedResult(
                      null
                    );
                  }}
                  className="w-full bg-transparent text-sm font-medium text-white outline-none"
                >
                  {currencies.map(
                    (currency) => (
                      <option
                        key={
                          currency.code
                        }
                        value={
                          currency.code
                        }
                        className="bg-slate-900 text-white"
                      >
                        {currency.code} —{" "}
                        {currency.name}
                      </option>
                    )
                  )}
                </select>

              </div>

              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(
                    e.target.value
                  );

                  setConvertedResult(
                    null
                  );
                }}
                placeholder="Enter amount"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-5 text-2xl font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
              />

            </div>

            {/* SWAP */}

            <button
              onClick={handleSwap}
              title="Swap currencies"
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-400/25 bg-blue-500/10 text-2xl text-blue-300 transition hover:rotate-180 hover:bg-blue-500/20"
            >
              ⇄
            </button>

            {/* TO */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-400">
                To
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">

                <span className="text-2xl">
                  {selectedTo.flag}
                </span>

                <select
                  value={toCurrency}
                  onChange={(e) => {
                    setToCurrency(
                      e.target.value
                    );

                    setConvertedResult(
                      null
                    );
                  }}
                  className="w-full bg-transparent text-sm font-medium text-white outline-none"
                >
                  {currencies.map(
                    (currency) => (
                      <option
                        key={
                          currency.code
                        }
                        value={
                          currency.code
                        }
                        className="bg-slate-900 text-white"
                      >
                        {currency.code} —{" "}
                        {currency.name}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="mt-3 flex min-h-[77px] items-center justify-between gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-5">

                <span className="text-xs text-slate-400">
                  {toCurrency}
                </span>

                <strong className="text-3xl text-emerald-300">
                  {loading
                    ? "..."
                    : formatNumber(
                        calculatedResult
                      )}
                </strong>

              </div>

            </div>

          </div>

          {/* CONVERT */}

          <button
            onClick={handleConvert}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-500/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Getting Latest Rate..."
              : "Convert Currency"}
          </button>

          {/* ERROR */}

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* RESULT BELOW BUTTON */}

          {convertedResult !== null &&
            !loading &&
            !error && (
              <div className="mt-5 rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-emerald-400/5 p-6">

                <p className="text-center text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Conversion Result
                </p>

                <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row">

                  <div className="flex items-center gap-3">

                    <span className="text-4xl">
                      {selectedFrom.flag}
                    </span>

                    <strong className="text-2xl sm:text-3xl">
                      {formatNumber(
                        Number(amount)
                      )}{" "}
                      {fromCurrency}
                    </strong>

                  </div>

                  <span className="text-3xl text-blue-400">
                    →
                  </span>

                  <div className="flex items-center gap-3">

                    <span className="text-4xl">
                      {selectedTo.flag}
                    </span>

                    <strong className="text-2xl text-emerald-300 sm:text-3xl">
                      {formatNumber(
                        convertedResult
                      )}{" "}
                      {toCurrency}
                    </strong>

                  </div>

                </div>

                <div className="mt-5 text-center">

                  <p className="text-sm font-semibold text-emerald-300">
                    1 {fromCurrency} ={" "}
                    {formatNumber(rate)}{" "}
                    {toCurrency}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Rate date:{" "}
                    {apiDate ||
                      "Not available"}
                  </p>

                </div>

              </div>
            )}

          {/* RATE INFO */}

          <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">

            <div className="bg-slate-950/60 p-4">

              <span className="block text-[10px] text-slate-500">
                Exchange Rate
              </span>

              <strong className="mt-1 block text-sm text-slate-200">
                {rate
                  ? `1 ${fromCurrency} = ${formatNumber(rate)} ${toCurrency}`
                  : "Loading rate..."}
              </strong>

            </div>

            <div className="bg-slate-950/60 p-4">

              <span className="block text-[10px] text-slate-500">
                Rate Date
              </span>

              <strong className="mt-1 block text-sm text-slate-200">
                {apiDate ||
                  "Not available"}
              </strong>

            </div>

          </div>

        </section>

        {/* POPULAR CURRENCIES */}

        <section className="mt-10">

          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>
              <h3 className="text-xl font-bold">
                Popular currencies
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Quickly choose a destination currency.
              </p>
            </div>

            <span className="text-[11px] text-slate-500">
              {currencies.length} currencies available
            </span>

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {popularCurrencies.map(
              (code) => {
                const currency =
                  getCurrency(code);

                return (
                  <button
                    key={code}
                    onClick={() =>
                      handlePopularCurrency(
                        code
                      )
                    }
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      toCurrency === code
                        ? "border-blue-400/50 bg-blue-500/10"
                        : "border-white/10 bg-slate-900/70 hover:border-blue-400/30 hover:bg-slate-800"
                    }`}
                  >

                    <span className="text-3xl">
                      {currency.flag}
                    </span>

                    <div>
                      <strong className="block text-sm">
                        {currency.code}
                      </strong>

                      <span className="mt-1 block text-[10px] text-slate-400">
                        {currency.name}
                      </span>
                    </div>

                  </button>
                );
              }
            )}

          </div>

        </section>

        {/* COUNTRIES */}

        <section className="mt-10">

          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <h3 className="text-xl font-bold">
                Countries & currencies
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Search and select any currency.
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search country or currency..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 sm:w-72"
            />

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {filteredCurrencies.map(
              (currency) => (
                <button
                  key={currency.code}
                  onClick={() =>
                    handlePopularCurrency(
                      currency.code
                    )
                  }
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    toCurrency ===
                    currency.code
                      ? "border-blue-400/50 bg-blue-500/10"
                      : "border-white/10 bg-slate-900/60 hover:border-blue-400/30 hover:bg-slate-800"
                  }`}
                >

                  <span className="text-3xl">
                    {currency.flag}
                  </span>

                  <div className="min-w-0">

                    <strong className="block text-sm">
                      {currency.code}
                    </strong>

                    <span className="mt-1 block truncate text-[10px] text-slate-400">
                      {currency.country}
                    </span>

                    <small className="mt-1 block truncate text-[9px] text-slate-600">
                      {currency.name}
                    </small>

                  </div>

                </button>
              )
            )}

          </div>

          {filteredCurrencies.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-500">
              No currency found.
            </div>
          )}

        </section>

        {/* HISTORY */}

        <section className="mt-10">

          <div className="mb-4">

            <h3 className="text-xl font-bold">
              Conversion History
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Your recent conversions.
            </p>

          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-300">
                ↗
              </div>

              <h4 className="mt-4 text-sm font-semibold">
                No conversions yet
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Your recent conversions will appear here.
              </p>

            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10">

              {history.map((item) => {

                const from =
                  getCurrency(
                    item.from
                  );

                const to =
                  getCurrency(
                    item.to
                  );

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 gap-4 border-b border-white/10 bg-slate-900/60 p-4 last:border-b-0 sm:grid-cols-[1fr_30px_1fr_1.3fr] sm:items-center"
                  >

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        {from.flag}
                      </span>

                      <div>
                        <strong className="block text-xs">
                          {item.amount}{" "}
                          {item.from}
                        </strong>

                        <small className="text-[9px] text-slate-500">
                          {from.name}
                        </small>
                      </div>

                    </div>

                    <div className="hidden text-center text-slate-500 sm:block">
                      →
                    </div>

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        {to.flag}
                      </span>

                      <div>
                        <strong className="block text-xs">
                          {formatNumber(
                            item.result
                          )}{" "}
                          {item.to}
                        </strong>

                        <small className="text-[9px] text-slate-500">
                          {to.name}
                        </small>
                      </div>

                    </div>

                    <div className="text-xs">

                      <span className="block text-emerald-300">
                        1 {item.from} ={" "}
                        {formatNumber(
                          item.rate
                        )}{" "}
                        {item.to}
                      </span>

                      <span className="mt-1 block text-[9px] text-slate-600">
                        {item.date}
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}

      <footer className="border-t border-white/10 px-5 py-6 text-center text-[10px] text-slate-600">
        CurrencyFlow • Exchange rates powered by
        Frankfurter API
      </footer>

    </div>
  );
}

export default App;