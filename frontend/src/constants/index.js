export const codeModes = [
	"javascript",
	"typescript",
	"java",
	"html",
	"css",
	"python",
	"ruby",
	"cpp",
	"csharp",
	"php",
	"sql",
	"json",
	"xml",
	"markdown",
];

export const codeThemes = [
	"monokai",
	"github",
	"tomorrow",
	"twilight",
	"xcode",
	"solarized_dark",
	"solarized_light",
];

/**
 * Intelligent Code Language Auto-Detector
 * Accurately detects C++, Python, Java, C#, TypeScript, JavaScript, HTML, CSS, SQL, PHP, Ruby, JSON, XML
 */
export const detectLanguage = (code) => {
	if (!code || typeof code !== "string" || !code.trim()) {
		return null;
	}

	const text = code.trim();

	// 1. C++ / C detection
	if (
		/#include\s*<[a-zA-Z0-9_.]+>|#include\s*"[a-zA-Z0-9_.]+"|std::\w+|cout\s*<<|cin\s*>>|printf\s*\(|scanf\s*\(|nullptr|int\s+main\s*\(|void\s+main\s*\(|#define\s+|#pragma\s+|std::vector|std::string|std::cout|std::endl|template\s*<typename|template\s*<class/i.test(
			text
		)
	) {
		return "cpp";
	}

	// 2. Python detection
	if (
		/^\s*def\s+\w+\s*\(|^\s*import\s+\w+|^\s*from\s+\w+\s+import|^\s*class\s+\w+.*:|print\s*\(|__name__\s*==\s*['"]__main__['"]|elif\s+|if\s+__name__|self\.\w+|lambda\s+\w+:|None|True|False|in\s+range\s*\(|sys\.exit\s*\(|np\.\w+|pd\.\w+/m.test(
			text
		)
	) {
		return "python";
	}

	// 3. Java detection
	if (
		/public\s+class\s+\w+|public\s+static\s+void\s+main|System\.out\.println|System\.out\.print|import\s+java\.|package\s+[\w.]+;|implements\s+\w+|extends\s+\w+|@Override|String\[\]\s+args|private\s+[\w<>[\]]+\s+\w+;/i.test(
			text
		)
	) {
		return "java";
	}

	// 4. C# detection
	if (
		/using\s+System|namespace\s+[\w.]+|Console\.WriteLine|Console\.Write|public\s+static\s+void\s+Main|string\[\]\s+args|async\s+Task|List<[\w.]+>\s+\w+\s*=\s*new/i.test(
			text
		)
	) {
		return "csharp";
	}

	// 5. HTML detection
	if (
		/<!doctype\s+html|<html|<head|<body|<div|<span|<p|<script|<style|<\/div>|<\/body>|<\/html>/i.test(
			text
		)
	) {
		return "html";
	}

	// 6. CSS detection
	if (
		/(?:^|\n)\s*[.#]?[\w-]+\s*\{\s*[\w-]+:\s*[^}]+;?\s*\}/m.test(text) ||
		/@media\s*\(|@keyframes\s+[\w-]+\s*\{/i.test(text)
	) {
		return "css";
	}

	// 7. SQL detection
	if (
		/\b(SELECT\s+.*?\s+FROM|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE|DROP\s+TABLE|ALTER\s+TABLE|WHERE|GROUP\s+BY|ORDER\s+BY|HAVING|INNER\s+JOIN|LEFT\s+JOIN)\b/i.test(
			text
		) &&
		!/function|const|let|var|def\s|class\s/i.test(text)
	) {
		return "sql";
	}

	// 8. PHP detection
	if (/<\?php|\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*\s*=|echo\s+['"$]|print_r\s*\(|var_dump\s*\(/i.test(text)) {
		return "php";
	}

	// 9. Ruby detection
	if (/def\s+\w+[\s\S]*?end\b|puts\s+['"$]|require\s+['"]|attr_accessor|attr_reader/i.test(text) && !/function|const|let|var|;/i.test(text)) {
		return "ruby";
	}

	// 10. JSON detection
	if (
		(text.startsWith("{") && text.endsWith("}")) ||
		(text.startsWith("[") && text.endsWith("]"))
	) {
		try {
			JSON.parse(text);
			return "json";
		} catch (e) {
			// not JSON
		}
	}

	// 11. XML detection
	if (/<\?xml\s+version=|<[\w-:]+\s+xmlns[:=]/i.test(text)) {
		return "xml";
	}

	// 12. TypeScript detection
	if (
		/:\s*(string|number|boolean|any|void|never|unknown|Record<|Array<|Promise<)|interface\s+\w+\s*\{|type\s+\w+\s*=|as\s+const|enum\s+\w+\s*\{|<[A-Z]\w*>\s*\(/m.test(
			text
		)
	) {
		return "typescript";
	}

	// 13. JavaScript detection
	if (
		/\b(const|let|var|function|return|console\.log|document\.getElementById|window\.|export\s+default|export\s+const|import\s+.*?from\s+['"]|=>)\b/m.test(
			text
		)
	) {
		return "javascript";
	}

	return null;
};
