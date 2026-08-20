import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * CO3 - EXP 8: Online Student Result Processing Using Servlet
 * Accepts 5 subject marks, validates range 0-100 & numericality, computes statistics and renders result table.
 */
@WebServlet(name = "StudentResultServlet", urlPatterns = {"/StudentResultServlet", "/processResult"})
public class StudentResultServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        String studentName = request.getParameter("studentName");
        String regNumber   = request.getParameter("regNumber");
        String department  = request.getParameter("department");

        String[] subNames = {
            "Web Technology",
            "Database Management Systems",
            "Data Structures & Algorithms",
            "Operating Systems",
            "Computer Networks"
        };

        String[] markParams = {
            request.getParameter("mark1"),
            request.getParameter("mark2"),
            request.getParameter("mark3"),
            request.getParameter("mark4"),
            request.getParameter("mark5")
        };

        // 1. Validation Logic
        boolean hasError = false;
        StringBuilder errorReport = new StringBuilder();
        int[] marks = new int[5];

        if (studentName == null || studentName.trim().isEmpty()) {
            hasError = true;
            errorReport.append("<li>Student Name cannot be empty.</li>");
        }
        if (regNumber == null || regNumber.trim().isEmpty()) {
            hasError = true;
            errorReport.append("<li>Register Number cannot be empty.</li>");
        }

        for (int i = 0; i < 5; i++) {
            String mStr = markParams[i];
            if (mStr == null || mStr.trim().isEmpty()) {
                hasError = true;
                errorReport.append("<li>Mark for ").append(subNames[i]).append(" is missing.</li>");
                continue;
            }
            try {
                int val = Integer.parseInt(mStr.trim());
                if (val < 0 || val > 100) {
                    hasError = true;
                    errorReport.append("<li>Mark for ").append(subNames[i]).append(" must be between 0 and 100 (Received: ").append(val).append(").</li>");
                } else {
                    marks[i] = val;
                }
            } catch (NumberFormatException e) {
                hasError = true;
                errorReport.append("<li>Mark for ").append(subNames[i]).append(" must be a valid integer number.</li>");
            }
        }

        // 2. Render Response
        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("  <meta charset='UTF-8'/>");
        out.println("  <meta name='viewport' content='width=device-width, initial-scale=1.0'/>");
        out.println("  <title>Student Semester Result - Servlet</title>");
        out.println("  <link rel='preconnect' href='https://fonts.googleapis.com'/>");
        out.println("  <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800&display=swap' rel='stylesheet'/>");
        out.println("  <style>");
        out.println("    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 30px 20px; margin: 0; }");
        out.println("    .card { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; padding: 40px; max-width: 780px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); backdrop-filter: blur(16px); }");
        out.println("    .badge { background: #3b82f6; color: #ffffff; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 14px; }");
        out.println("    h1 { font-family: 'Outfit', sans-serif; font-size: 2.1rem; margin: 0 0 8px; color: #f8fafc; }");
        out.println("    .res-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #0f172a; border-radius: 10px; overflow: hidden; border: 1px solid #334155; }");
        out.println("    .res-table th { background: #1e293b; color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; padding: 12px 16px; text-align: left; }");
        out.println("    .res-table td { padding: 12px 16px; border-bottom: 1px solid #1e293b; font-size: 0.9rem; }");
        out.println("    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }");
        out.println("    .stat-box { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 14px; text-align: center; }");
        out.println("    .stat-label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; display: block; }");
        out.println("    .stat-val { font-size: 1.3rem; font-weight: 800; color: #38bdf8; }");
        out.println("    .pass-pill { background: #065f46; color: #6ee7b7; padding: 4px 12px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; display: inline-block; }");
        out.println("    .fail-pill { background: #7f1d1d; color: #fca5a5; padding: 4px 12px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; display: inline-block; }");
        out.println("    .btn { display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; }");
        out.println("    .err-box { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 10px; padding: 20px; margin: 20px 0; color: #fca5a5; }");
        out.println("  </style>");
        out.println("</head>");
        out.println("<body>");
        out.println("  <div class='card'>");

        if (hasError) {
            out.println("    <span class='badge' style='background:#ef4444;'>Validation Error</span>");
            out.println("    <h1 style='color:#ef4444;'>Marks Processing Failed</h1>");
            out.println("    <p>Please review and correct the following errors:</p>");
            out.println("    <div class='err-box'><ul>" + errorReport.toString() + "</ul></div>");
        } else {
            // 3. Compute Results
            int total = 0;
            int highest = marks[0];
            int lowest  = marks[0];
            boolean allPassed = true;

            for (int m : marks) {
                total += m;
                if (m > highest) highest = m;
                if (m < lowest)  lowest  = m;
                if (m < 50) allPassed = false; // Passing cutoff: 50%
            }

            double average = total / 5.0;
            String grade;
            if (average >= 90) grade = "O (Outstanding)";
            else if (average >= 80) grade = "A+ (Excellent)";
            else if (average >= 70) grade = "A (Very Good)";
            else if (average >= 60) grade = "B+ (Good)";
            else if (average >= 50) grade = "B (Average)";
            else grade = "RA (Reappear)";

            String status = allPassed ? "PASS" : "FAIL";

            out.println("    <span class='badge'>Semester Exam Result</span>");
            out.println("    <h1>" + escapeHtml(studentName) + "</h1>");
            out.println("    <p style='color:#94a3b8;'>Register No: <strong style='color:#38bdf8; font-family:monospace;'>" + escapeHtml(regNumber.toUpperCase()) + "</strong> | Dept: " + escapeHtml(department) + "</p>");

            // Stat Boxes
            out.println("    <div class='stats-grid'>");
            out.println("      <div class='stat-box'><span class='stat-label'>Total Marks</span><span class='stat-val'>" + total + " / 500</span></div>");
            out.println("      <div class='stat-box'><span class='stat-label'>Average</span><span class='stat-val'>" + String.format("%.2f", average) + "%</span></div>");
            out.println("      <div class='stat-box'><span class='stat-label'>Grade</span><span class='stat-val' style='font-size:1rem;'>" + grade + "</span></div>");
            out.println("      <div class='stat-box'><span class='stat-label'>Result</span><span class='" + (allPassed ? "pass-pill" : "fail-pill") + "'>" + status + "</span></div>");
            out.println("    </div>");

            // Subject Table
            out.println("    <table class='res-table'>");
            out.println("      <thead><tr><th>#</th><th>Subject Name</th><th>Max Marks</th><th>Marks Scored</th><th>Status</th></tr></thead>");
            out.println("      <tbody>");
            for (int i = 0; i < 5; i++) {
                boolean subPass = marks[i] >= 50;
                out.println("        <tr>");
                out.println("          <td>" + (i + 1) + "</td>");
                out.println("          <td><strong>" + subNames[i] + "</strong></td>");
                out.println("          <td>100</td>");
                out.println("          <td style='font-weight:700; color:" + (subPass ? "#38bdf8" : "#f87171") + ";'>" + marks[i] + "</td>");
                out.println("          <td><span class='" + (subPass ? "pass-pill" : "fail-pill") + "'>" + (subPass ? "PASS" : "FAIL") + "</span></td>");
                out.println("        </tr>");
            }
            out.println("      </tbody>");
            out.println("    </table>");
        }

        out.println("    <a href='index.html' class='btn'>&larr; Process Another Result</a>");
        out.println("  </div>");
        out.println("</body>");
        out.println("</html>");
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
