const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = path.join(__dirname, '../temp');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const executeCode = async (sourceCode, language, input, driverConfig) => {
    const id = uuidv4();
    const lang = language.toLowerCase();

    // Create temp files for code and input
    const inputPath = path.join(TEMP_DIR, `${id}.in`);
    fs.writeFileSync(inputPath, input || '');

    return new Promise((resolve, reject) => {
        let command = '';
        let filePath = '';

        if (lang === 'javascript') {
            filePath = path.join(TEMP_DIR, `${id}.js`);
            fs.writeFileSync(filePath, sourceCode);
            command = `node ${filePath} < ${inputPath}`;
        } else if (lang === 'python') {
            filePath = path.join(TEMP_DIR, `${id}.py`);
            fs.writeFileSync(filePath, sourceCode);
            command = `python ${filePath} < ${inputPath}`;
        } else if (lang === 'cpp') {
            filePath = path.join(TEMP_DIR, `${id}.cpp`);
            const exePath = path.join(TEMP_DIR, `${id}.exe`);
            fs.writeFileSync(filePath, sourceCode);
            command = `g++ ${filePath} -o ${exePath} && ${exePath} < ${inputPath}`;
        } else if (lang === 'java') {
            const className = `Solution_${id.replace(/-/g, '')}`;
            const functionName = driverConfig?.functionName || 'solve';
            const parameterTypes = driverConfig?.parameterTypes || [];
            const returnType = driverConfig?.returnType || 'void';

            // Function to generate Java parsing code for a value
            const getJavaParser = (type, value) => {
                if (type === 'int') return value;
                if (type === 'double') return value;
                if (type === 'boolean') return value.toLowerCase();
                if (type === 'String') return `"${value.replace(/"/g, '')}"`;
                if (type === 'int[]') {
                    const vals = value.replace(/[\[\]]/g, '').split(',').map(v => v.trim()).filter(v => v !== '');
                    return `new int[]{${vals.join(', ')}}`;
                }
                if (type === 'double[]') {
                    const vals = value.replace(/[\[\]]/g, '').split(',').map(v => v.trim()).filter(v => v !== '');
                    return `new double[]{${vals.join(', ')}}`;
                }
                if (type === 'ListNode') {
                    return `ListNode.fromArray("${value.replace(/"/g, '')}")`;
                }
                return `null`;
            };

            // Parse input string: "nums = [1,12,-5,-6,50,3], k = 4"
            const inputParts = input.split(/,\s*(?=[a-zA-Z]+\s*=)/);
            const argInitializers = parameterTypes.map((type, i) => {
                const part = inputParts[i] || "";
                const valStr = part.includes('=') ? part.split('=')[1].trim() : part.trim();
                return `${type} arg${i} = ${getJavaParser(type, valStr)};`;
            });

            const argNames = parameterTypes.map((_, i) => `arg${i}`).join(', ');

            // Wrap user code and inject main
            let wrappedCode = `import java.util.*;\n` + sourceCode.replace(/class\s+Solution/, `public class ${className}`);

            let outputFormatter = `System.out.println(result);`;
            if (returnType.includes('[]')) {
                outputFormatter = `System.out.println(Arrays.toString(result));`;
            } else if (returnType === 'ListNode') {
                outputFormatter = `System.out.println(result == null ? "[]" : result.toString());`;
            }

            wrappedCode += `\n\nclass ListNode {\n    int val;\n    ListNode next;\n    ListNode() {}\n    ListNode(int val) { this.val = val; }\n    ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n    \n    public static ListNode fromArray(String str) {\n        if (str == null || str.equals("[]") || str.isEmpty() || str.equals("null")) return null;\n        String[] parts = str.replace("[", "").replace("]", "").split(",");\n        ListNode dummy = new ListNode(0);\n        ListNode current = dummy;\n        for (String part : parts) {\n            String s = part.trim();\n            if (s.isEmpty()) continue;\n            current.next = new ListNode(Integer.parseInt(s));\n            current = current.next;\n        }\n        return dummy.next;\n    }\n    \n    @Override\n    public String toString() {\n        StringBuilder sb = new StringBuilder("[");\n        ListNode curr = this;\n        while (curr != null) {\n            sb.append(curr.val);\n            if (curr.next != null) sb.append(",");\n            curr = curr.next;\n        }\n        sb.append("]");\n        return sb.toString();\n    }\n}\n\nclass Driver {\n    public static void main(String[] args) {\n        ${className} sol = new ${className}();\n        ${argInitializers.join('\n        ')}\n        ${returnType} result = sol.${functionName}(${argNames});\n        ${outputFormatter}\n    }\n}`;

            filePath = path.join(TEMP_DIR, `${className}.java`);
            fs.writeFileSync(filePath, wrappedCode);
            command = `javac ${filePath} && java -cp ${TEMP_DIR} Driver`;
        } else {
            return reject(new Error('Unsupported language for local execution'));
        }

        const startTime = process.hrtime();

        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            const diff = process.hrtime(startTime);
            let timeInSec = (diff[0] + diff[1] / 1e9);

            // Subtract language-specific overhead (compilation + startup)
            // These values are estimated for a local dev environment
            const overheads = {
                'java': 1.5,      // javac + JVM startup
                'cpp': 0.8,       // g++ compilation
                'python': 0.1,    // interpreter startup
                'javascript': 0.05 // node startup
            };

            const overhead = overheads[lang] || 0;
            timeInSec = Math.max(0.001, timeInSec - overhead); // Minimum 1ms

            // Format to 3 decimal places
            const formattedTime = timeInSec.toFixed(3);

            // Cleanup files
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (lang === 'cpp') {
                    const exePath = filePath.replace('.cpp', '.exe');
                    if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
                }
                if (lang === 'java') {
                    const classPath = filePath.replace('.java', '.class');
                    if (fs.existsSync(classPath)) fs.unlinkSync(classPath);
                    const driverClassPath = path.join(TEMP_DIR, 'Driver.class');
                    if (fs.existsSync(driverClassPath)) fs.unlinkSync(driverClassPath);
                }
            } catch (err) {
                console.error('Cleanup error:', err);
            }

            if (error && error.killed) {
                return resolve({
                    status: { description: 'Time Limit Exceeded' },
                    stdout: '',
                    stderr: 'Execution timed out (10s limit)',
                    time: formattedTime,
                    memory: 0
                });
            }

            resolve({
                status: { description: error ? 'Runtime Error' : 'Accepted' },
                stdout: Buffer.from(stdout).toString('base64'),
                stderr: Buffer.from(stderr || (error ? error.message : '')).toString('base64'),
                compile_output: '',
                time: formattedTime,
                memory: 0 // Local memory tracking is complex
            });
        });
    });
};

module.exports = { executeCode };
