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
 * CO3 - EXP 7: Student Registration Form Processing Using Servlet
 * Processes POST requests, validates empty fields, and outputs formatted profile dynamically.
 */
@WebServlet(name = "StudentRegistrationServlet", urlPatterns = {"/StudentRegistrationServlet", "/registerStudent"})
public class StudentRegistrationServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Set Response MIME Type & Character Encoding
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        // 2. Extract Form Parameters using request.getParameter()
        String studentName = request.getParameter("studentName");
        String regNumber   = request.getParameter("regNumber");
        String email       = request.getParameter("email");
        String department  = request.getParameter("department");
        String semester    = request.getParameter("semester");

        // 3. Server-Side Validation: Check Empty Fields
        boolean hasError = false;
        StringBuilder errorMsg = new StringBuilder();

        if (isNullOrEmpty(studentName)) {
            hasError = true;
            errorMsg.append("<li>Student Full Name is required.</li>");
        }
        if (isNullOrEmpty(regNumber)) {
            hasError = true;
            errorMsg.append("<li>Register Number is required.</li>");
        }
        if (isNullOrEmpty(email) || !email.contains("@")) {
            hasError = true;
            errorMsg.append("<li>A valid Email address is required.</li>");
        }
        if (isNullOrEmpty(department)) {
            hasError = true;
            errorMsg.append("<li>Department selection is required.</li>");
        }
        if (isNullOrEmpty(semester)) {
            hasError = true;
            errorMsg.append("<li>Semester selection is required.</li>");
        }

        // 4. Render Response (Error or Success Card)
        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("  <meta charset='UTF-8'/>");
        out.println("  <meta name='viewport' content='width=device-width, initial-scale=1.0'/>");
        out.println("  <title>Student Registration - Servlet Response</title>");
        out.println("  <link rel='preconnect' href='https://fonts.googleapis.com'/>");
        out.println("  <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800&display=swap' rel='stylesheet'/>");
        out.println("  <style>");
        out.println("    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; margin: 0; }");
        out.println("    .res-card { background: rgba(30, 27, 75, 0.85); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; padding: 40px; max-width: 680px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); backdrop-filter: blur(16px); }");
        out.println("    .badge-success { background: #10b981; color: #ffffff; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 16px; letter-spacing: 1px; }");
        out.println("    .badge-error { background: #ef4444; color: #ffffff; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 16px; letter-spacing: 1px; }");
        out.println("    h1 { font-family: 'Outfit', sans-serif; font-size: 2.1rem; margin: 0 0 10px; }");
        out.println("    .table-details { width: 100%; border-collapse: collapse; margin: 24px 0; background: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #312e81; }");
        out.println("    .table-details td { padding: 14px 18px; border-bottom: 1px solid #1e1b4b; font-size: 0.95rem; }");
        out.println("    .table-details tr:last-child td { border-bottom: none; }");
        out.println("    .label-col { color: #a5b4fc; font-weight: 600; width: 35%; }");
        out.println("    .val-col { color: #f8fafc; font-weight: 700; }");
        out.println("    .error-box { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 10px; padding: 20px; margin: 20px 0; }");
        out.println("    .error-box ul { margin: 0; padding-left: 20px; color: #fca5a5; }");
        out.println("    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; }");
        out.println("  </style>");
        out.println("</head>");
        out.println("<body>");
        out.println("  <div class='res-card'>");

        if (hasError) {
            out.println("    <span class='badge-error'>Validation Error</span>");
            out.println("    <h1 style='color:#ef4444;'>Registration Incomplete</h1>");
            out.println("    <p style='color:#cbd5e1;'>The servlet detected missing or invalid form values:</p>");
            out.println("    <div class='error-box'><ul>" + errorMsg.toString() + "</ul></div>");
        } else {
            String timeStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy — hh:mm a"));
            out.println("    <span class='badge-success'>Servlet doPost() Success</span>");
            out.println("    <h1 style='color:#818cf8;'>Student Registration Confirmed</h1>");
            out.println("    <p style='color:#94a3b8;'>The submitted POST data was parsed and validated by <code>StudentRegistrationServlet</code>.</p>");
            out.println("    <table class='table-details'>");
            out.println("      <tr><td class='label-col'>Full Name:</td><td class='val-col'>" + escapeHtml(studentName) + "</td></tr>");
            out.println("      <tr><td class='label-col'>Register Number:</td><td class='val-col' style='font-family:monospace; color:#38bdf8;'>" + escapeHtml(regNumber.toUpperCase()) + "</td></tr>");
            out.println("      <tr><td class='label-col'>Email Address:</td><td class='val-col'>" + escapeHtml(email) + "</td></tr>");
            out.println("      <tr><td class='label-col'>Department:</td><td class='val-col'>" + escapeHtml(department) + "</td></tr>");
            out.println("      <tr><td class='label-col'>Semester / Year:</td><td class='val-col'>" + escapeHtml(semester) + "</td></tr>");
            out.println("      <tr><td class='label-col'>Submission Time:</td><td class='val-col'>" + timeStr + "</td></tr>");
            out.println("    </table>");
        }

        out.println("    <a href='index.html' class='btn'>&larr; Back to Registration Form</a>");
        out.println("  </div>");
        out.println("</body>");
        out.println("</html>");
    }

    private boolean isNullOrEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
