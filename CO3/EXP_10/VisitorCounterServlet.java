import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicInteger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * CO3 - EXP 10: Thread-Safe Concurrent Visitor Counter Using Servlet
 * Demonstrates:
 * 1. UNSAFE counter: standard int instance variable prone to race conditions (read-modify-write hazard).
 * 2. THREAD-SAFE counter: AtomicInteger & synchronized block ensuring atomicity across concurrent worker threads.
 * 3. Explains thread confinement with local variables.
 */
@WebServlet(name = "VisitorCounterServlet", urlPatterns = {"/VisitorCounterServlet", "/counter"})
public class VisitorCounterServlet extends HttpServlet {

    // 1. UNSAFE SHARED INSTANCE VARIABLE (Vulnerable to concurrency race conditions)
    private int unsafeHitCount = 0;

    // 2. THREAD-SAFE ATOMIC VARIABLE (Hardware CAS - Compare And Swap instruction)
    private final AtomicInteger safeAtomicCount = new AtomicInteger(0);

    // 3. SYNCHRONIZED COUNTER
    private int safeSynchronizedCount = 0;
    private final Object lock = new Object();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        // 4. REQUEST-SPECIFIC LOCAL VARIABLE (Thread-safe by confinement - allocated on stack per thread)
        String clientIp = request.getRemoteAddr();
        String threadName = Thread.currentThread().getName();

        // A. Unsafe Increment (Non-atomic: read -> add -> write)
        unsafeHitCount++;

        // B. Atomic Increment (Lock-free thread-safe)
        int currentSafeCount = safeAtomicCount.incrementAndGet();

        // C. Synchronized Block Increment (Mutex lock)
        int currentSyncCount;
        synchronized (lock) {
            safeSynchronizedCount++;
            currentSyncCount = safeSynchronizedCount;
        }

        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("  <meta charset='UTF-8'/>");
        out.println("  <meta name='viewport' content='width=device-width, initial-scale=1.0'/>");
        out.println("  <title>Thread-Safe Visitor Counter - Servlet</title>");
        out.println("  <link rel='preconnect' href='https://fonts.googleapis.com'/>");
        out.println("  <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800&display=swap' rel='stylesheet'/>");
        out.println("  <style>");
        out.println("    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #064e3b 100%); color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; margin: 0; }");
        out.println("    .card { background: rgba(6, 78, 59, 0.85); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 20px; padding: 40px; max-width: 750px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); backdrop-filter: blur(16px); }");
        out.println("    .badge { background: #10b981; color: #ffffff; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 14px; }");
        out.println("    h1 { font-family: 'Outfit', sans-serif; font-size: 2.1rem; margin: 0 0 10px; color: #a7f3d0; }");
        out.println("    .counter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }");
        out.println("    .counter-box { background: #0f172a; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #047857; }");
        out.println("    .box-title { font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px; font-weight: 700; }");
        out.println("    .box-val { font-size: 2.2rem; font-weight: 800; font-family: 'Outfit', sans-serif; }");
        out.println("    .text-unsafe { color: #f87171; }");
        out.println("    .text-safe { color: #34d399; }");
        out.println("    .meta-box { background: rgba(0, 0, 0, 0.25); border-radius: 10px; padding: 14px 18px; margin-bottom: 24px; font-size: 0.88rem; border: 1px solid rgba(255, 255, 255, 0.1); }");
        out.println("    .btn-row { display: flex; gap: 12px; }");
        out.println("    .btn { padding: 12px 22px; border-radius: 10px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-size: 0.9rem; }");
        out.println("    .btn-primary { background: linear-gradient(135deg, #10b981, #059669); color: white; }");
        out.println("    .btn-secondary { background: #064e3b; color: #a7f3d0; border: 1px solid #047857; }");
        out.println("  </style>");
        out.println("</head>");
        out.println("<body>");
        out.println("  <div class='card'>");
        out.println("    <span class='badge'>Servlet Concurrency Inspector</span>");
        out.println("    <h1>Concurrent Visitor Counter</h1>");
        out.println("    <p style='color:#a7f3d0;'>Servlet instances are singletons shared across multiple worker threads. Instance variables must be synchronized or atomic to avoid lost updates.</p>");
        out.println("    <div class='counter-grid'>");
        out.println("      <div class='counter-box'>");
        out.println("        <div class='box-title text-unsafe'>⚠️ Unsafe Primitive (int)</div>");
        out.println("        <div class='box-val text-unsafe'>" + unsafeHitCount + "</div>");
        out.println("        <p style='font-size:0.75rem; color:#94a3b8; margin:6px 0 0;'>Race condition hazard under concurrent traffic</p>");
        out.println("      </div>");
        out.println("      <div class='counter-box'>");
        out.println("        <div class='box-title text-safe'>🛡️ Thread-Safe (AtomicInteger)</div>");
        out.println("        <div class='box-val text-safe'>" + currentSafeCount + "</div>");
        out.println("        <p style='font-size:0.75rem; color:#94a3b8; margin:6px 0 0;'>Lock-free atomic CAS memory consistency</p>");
        out.println("      </div>");
        out.println("    </div>");
        out.println("    <div class='meta-box'>");
        out.println("      <div><strong>Current Worker Thread:</strong> <code>" + threadName + "</code></div>");
        out.println("      <div><strong>Request Client IP (Local Variable):</strong> <code>" + clientIp + "</code></div>");
        out.println("      <div><strong>Synchronized Block Counter:</strong> <code>" + currentSyncCount + " hits</code></div>");
        out.println("    </div>");
        out.println("    <div class='btn-row'>");
        out.println("      <a href='VisitorCounterServlet' class='btn btn-primary'>🔄 Hit Counter (GET)</a>");
        out.println("      <a href='index.html' class='btn btn-secondary'>&larr; Back to Client Portal</a>");
        out.println("    </div>");
        out.println("  </div>");
        out.println("</body>");
        out.println("</html>");
    }
}
