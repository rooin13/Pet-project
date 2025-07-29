function buildQueryString(filters: Record<string, string[]>) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, values]) => {
        values.forEach((v) => {
            if (v) params.append(key, v);
        });
    });

    return params.toString(); // => "Model+Series=DeathAdder&Connection+Type=Bluetooth+connection"
}
