const denoConfig = await Deno.readTextFile("deno.json");
const denoConfigData = JSON.parse(denoConfig);

if (denoConfigData.imports) {
  console.log("Imported Modules:");

  for (const [moduleName, moduleSpecifier] of Object.entries(denoConfigData.imports)) {
    console.log(`Module Name: ${moduleName}`);
    console.log(`Module Specifier: ${moduleSpecifier}`);
    console.log("---------------------------");

    try {
      // 1. jsr: を https://jsr.io/ に変換
      let baseModuleUrl = moduleSpecifier.startsWith("jsr:")
        ? moduleSpecifier.replace("jsr:", "https://jsr.io/")
        : moduleSpecifier;

      // 2. @の2回目をスラッシュに置換し、^を削除
      baseModuleUrl = baseModuleUrl.replace(/@([^@]+)$/, "/$1").replace("^", "");

      // 3. mod.ts を追加して完全なURLを構築
      baseModuleUrl = `${baseModuleUrl}/mod.ts`;

      console.log(`Fetching from: ${baseModuleUrl}`);
      
      const response = await fetch(baseModuleUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Deno)",
        },
        redirect: "follow",
      });

      if (response.ok) {
        // Fetch結果を表示（テキストとして表示）
        const fetchedData = await response.text();
        console.log(`Fetched module: ${moduleName} successfully from ${baseModuleUrl}.`);
        console.log("Fetched Data: ");
        console.log(fetchedData); // 取得したデータを表示
      } else {
        console.error(`Failed to fetch module: ${moduleName} from ${baseModuleUrl}. Status: ${response.status} - ${response.statusText}`);
      }

    } catch (error) {
      console.error(`Error fetching module: ${moduleName}, ${error.message}`);
    }
  }
} else {
  console.log("No imports found in deno.json");
}