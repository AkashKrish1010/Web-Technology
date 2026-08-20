import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * CO3 - EXP 9: Servlet Lifecycle Demonstration
 * Demonstrates and logs the complete lifecycle: constructor, init(), service()/doGet(), and destroy().
 */
@WebServlet(name = "LifecycleServlet", urlPatterns = {"/LifecycleServlet", "/lifecycle"}, loadOnStartup = 1)
public class LifecycleServlet extends HttpServlet {

    private final AtomicInteger constructorCount = new AtomicInteger(0);
    private final AtomicInteger initCount        = new AtomicInteger(0);
    private final AtomicInteger serviceCount     = new AtomicInteger(0);
    private final AtomicInteger destroyCount     = new AtomicInteger(0);

    private String initTimestamp = "";
    private String initParameterValue = "";

    // 1. Servlet Constructor (Instantiated once by servlet container)
    public LifecycleServlet() {
        super();
        int c = constructorCount.incrementAndGet();
        System.out.println("[LifecycleServlet] -> Constructor called. Instance #" + c);
    }

    // 2. init() Method (Executed once after instantiation)
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        initCount.incrementAndGet();
        initTimestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        initParameterValue = config.getInitParameter("departmentCode");
        if (initParameterValue == null) initParameterValue = "CSE-2026";
        System.out.println("[LifecycleServlet] -> init() initialized with config: " + initParameterValue);
    }

    // 3. service() / doGet() Method (Executed for every client HTTP request)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int currentRequests = serviceCount.incrementAndGet();
        System.out.println("[LifecycleServlet] -> doGet() service dispatch #" + currentRequests);

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("  <meta charset='UTF-8'/>");
        out.println("  <title>Servlet Lifecycle Monitor</title>");
        out.println("  <link rel='preconnect' href='https://fonts.googleapis.com'/>");
        out.println("  <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800&display=swap' rel='stylesheet'/>");
        out.println("  <style>");
        out.println("    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; margin: 0; }");
        out.println("    .card { background: rgba(30, 27, 75, 0.9); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; padding: 40px; max-width: 720px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); backdrop-filter: blur(16px); }");
        out.println("    .badge { background: #8b5cf6; color: #fff; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 14px; }");
        out.println("    h1 { font-family: 'Outfit', sans-serif; font-size: 2.2rem; margin: 0 0 10px; color: #c4b5fd; }");
        out.println("    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0; }");
        out.println("    .step-box { background: #0f172a; border: 1px solid #312e81; border-radius: 12px; padding: 16px; text-align: center; }");
        out.println("    .step-label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; display: block; }");
        out.println("    .step-val { font-size: 1.6rem; font-weight: 800; color: #38bdf8; }");
        out.println("    .info-list { background: #0f172a; border: 1px solid #312e81; border-radius: 10px; padding: 16px; margin-bottom: 24px; font-size: 0.9rem; }");
        out.println("    .info-list div { padding: 6px 0; border-bottom: 1px dashed #1e1b4b; display: flex; justify-content: space-between; }");
        out.println("    .btn-row { display: flex; gap: 12px; }");
        out.println("    .btn { padding: 10px 20px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-size: 0.9rem; }");
        out.println("    .btn-primary { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; }");
        out.println("    .btn-secondary { background: #1e1b4b; color: #c4b5fd; border: 1px solid #4338ca; }");
        out.println("  </style>");
        out.println("</head>");
        out.println("<body>");
        out.println("  <div class='card'>");
        out.println("    <span class='badge'>Tomcat Lifecycle Inspector</span>");
        out.println("    <h1>Servlet Lifecycle State</h1>");
        out.println("    <p style='color:#94a3b8;'>Refresh the browser to observe how <code>doGet()</code> increments on each request while <code>init()</code> remains 1.</p>");
        out.println("    <div class='grid'>");
        out.println("      <div class='step-box'><span class='step-label'>1. Constructor</span><span class='step-val'>" + constructorCount.get() + "</span></div>");
        out.println("      <div class='step-box'><span class='step-label'>2. init()</span><span class='step-val'>" + initCount.get() + "</span></div>");
        out.println("      <div class='step-box'><span class='step-label'>3. service / doGet</span><span class='step-val' style='color:#a855f7;'>" + currentRequests + "</span></div>");
        out.println("      <div class='step-box'><span class='step-label'>4. destroy()</span><span class='step-val'>" + destroyCount.get() + "</span></div>");
        out.println("    </div>");
        out.println("    <div class='info-list'>");
        out.println("      <div><span style='color:#94a3b8;'>Servlet Initialized At:</span><strong>" + initTimestamp + "</strong></div>");
        out.println("      <div><span style='color:#94a3b8;'>Init Param (departmentCode):</span><strong style='color:#38bdf8;'>" + initParameterValue + "</strong></div>");
        out.println("      <div><span style='color:#94a3b8;'>Servlet Container:</span><span>" + getServletContext().getServerInfo() + "</span></div>");
        out.println("    </div>");
        out.println("    <div class='btn-row'>");
        out.println("      <a href='LifecycleServlet' class='btn btn-primary'>🔄 Refresh (Trigger doGet)</a>");
        out.println("      <a href='index.html' class='btn btn-secondary'>&larr; Back to Client Portal</a>");
        out.println("    </div>");
        out.println("  </div>");
        out.println("</body>");
        out.println("</html>");
    }

    // 4. destroy() Method (Executed when servlet is taken out of service / container undeploy)
    @Override
    public void destroy() {
        destroyCount.incrementAndGet();
        System.out.println("[LifecycleServlet] -> destroy() executed. Resources released.");
        super.destroy();
    }
}
