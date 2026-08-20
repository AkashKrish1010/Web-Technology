import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * CO3 - EXP 6: Basic Java Servlet for Dynamic Content Generation
 * Displays welcome message, student name, course name, and live server timestamp.
 */
@WebServlet(name = "WelcomeServlet", urlPatterns = {"/WelcomeServlet", "/welcome"})
public class WelcomeServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Set Response MIME Type & Character Encoding
        response.setContentType("text/html;charset=UTF-8");

        // 2. Obtain Dynamic Query Parameters or Defaults
        String studentName = request.getParameter("studentName");
        if (studentName == null || studentName.trim().isEmpty()) {
            studentName = "Arjun Sharma (RA2211003010042)";
        }

        String courseName = request.getParameter("courseName");
        if (courseName == null || courseName.trim().isEmpty()) {
            courseName = "Web Technology (21CS301T)";
        }

        // 3. Compute Server Timestamp Dynamically
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy — hh:mm:ss a");
        String formattedDateTime = now.format(formatter);

        // 4. Generate Dynamic HTML Output via PrintWriter
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html>");
            out.println("<html lang='en'>");
            out.println("<head>");
            out.println("  <meta charset='UTF-8'/>");
            out.println("  <meta name='viewport' content='width=device-width, initial-scale=1.0'/>");
            out.println("  <title>Welcome - Dynamic Servlet Response</title>");
            out.println("  <link rel='preconnect' href='https://fonts.googleapis.com'/>");
            out.println("  <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800&display=swap' rel='stylesheet'/>");
            out.println("  <style>");
            out.println("    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; margin: 0; }");
            out.println("    .servlet-card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px; max-width: 650px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); backdrop-filter: blur(16px); }");
            out.println("    .badge { background: #3b82f6; color: #ffffff; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 16px; letter-spacing: 1px; }");
            out.println("    h1 { font-family: 'Outfit', sans-serif; font-size: 2.2rem; margin: 0 0 12px; background: linear-gradient(135deg, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }");
            out.println("    p { color: #94a3b8; font-size: 1rem; line-height: 1.6; margin-bottom: 24px; }");
            out.println("    .info-box { background: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid #334155; margin-bottom: 24px; }");
            out.println("    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #1e293b; font-size: 0.95rem; }");
            out.println("    .info-row:last-child { border-bottom: none; }");
            out.println("    .info-label { color: #64748b; font-weight: 600; }");
            out.println("    .info-val { color: #38bdf8; font-weight: 700; }");
            out.println("    .btn-back { display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; transition: opacity 0.2s; }");
            out.println("    .btn-back:hover { opacity: 0.9; }");
            out.println("  </style>");
            out.println("</head>");
            out.println("<body>");
            out.println("  <div class='servlet-card'>");
            out.println("    <span class='badge'>Tomcat Dynamic Response</span>");
            out.println("    <h1>Welcome to Web Technology!</h1>");
            out.println("    <p>This dynamic webpage was generated on the server using <strong>Java HttpServlet (doGet)</strong> and streamed directly through <code>PrintWriter</code>.</p>");
            out.println("    <div class='info-box'>");
            out.println("      <div class='info-row'><span class='info-label'>Student Name:</span><span class='info-val'>" + escapeHtml(studentName) + "</span></div>");
            out.println("      <div class='info-row'><span class='info-label'>Course Name:</span><span class='info-val'>" + escapeHtml(courseName) + "</span></div>");
            out.println("      <div class='info-row'><span class='info-label'>Server Timestamp:</span><span class='info-val'>" + formattedDateTime + "</span></div>");
            out.println("      <div class='info-row'><span class='info-label'>HTTP Method:</span><span class='info-val'>GET (doGet)</span></div>");
            out.println("      <div class='info-row'><span class='info-label'>Protocol / Server:</span><span class='info-val'>" + request.getProtocol() + " (" + getServletContext().getServerInfo() + ")</span></div>");
            out.println("    </div>");
            out.println("    <a href='index.html' class='btn-back'>&larr; Back to Client Portal</a>");
            out.println("  </div>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
