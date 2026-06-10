<?php
/* =============================================================================
 * ZOOM Government Services — Contact Form Handler
 * -----------------------------------------------------------------------------
 * Receives enquiries from the website contact form (JSON or classic POST),
 * validates and sanitises them, then emails them to the configured inbox using
 * PHP's mail() — which works out of the box on GoDaddy / cPanel shared hosting.
 *
 * SECURITY NOTES
 *  • No secrets are hard-coded. The recipient can be set via an environment
 *    variable (CONTACT_TO) configured in cPanel ("Environment Variables" or an
 *    .htaccess SetEnv) so it never lives in the repository.
 *  • All header-bound fields are stripped of CR/LF to prevent email header
 *    injection.
 *  • A hidden "company" honeypot field silently absorbs bots.
 *  • Output is JSON; the front-end (js/contact.js) shows the result and falls
 *    back to a mailto: link if this endpoint is ever unavailable.
 *
 * CONFIG
 *  1. Set CONTACT_TO in cPanel, OR edit the $FALLBACK_TO default below.
 *  2. Optionally set CONTACT_FROM to a mailbox on your own domain (recommended
 *     for deliverability — many hosts reject mail "From" external domains).
 * ============================================================================= */

declare(strict_types=1);

/* ---- Configuration (no secrets; override via cPanel env vars) ------------- */
$FALLBACK_TO   = 'hello@zoomgovernmentservices.com';                 // TODO: your inbox
$FALLBACK_FROM = 'website@zoomgovernmentservices.com';               // a mailbox ON your domain
$BRAND         = 'ZOOM Government Services';

$TO   = getenv('CONTACT_TO')   ?: $FALLBACK_TO;
$FROM = getenv('CONTACT_FROM') ?: $FALLBACK_FROM;

/* ---- Always respond with JSON -------------------------------------------- */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(bool $ok, string $error = '', int $code = 200): void {
    http_response_code($ok ? 200 : $code);
    echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
    exit;
}

/* ---- Only accept POST ----------------------------------------------------- */
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

/* ---- Read input (support JSON body and form-encoded) ---------------------- */
$raw = file_get_contents('php://input');
$data = [];
if ($raw !== false && $raw !== '') {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $data = $decoded;
    }
}
if (empty($data)) {
    $data = $_POST; // classic form fallback
}

/* ---- Helpers -------------------------------------------------------------- */
function field(array $d, string $k): string {
    return isset($d[$k]) ? trim((string) $d[$k]) : '';
}
// Remove characters that could be used to inject extra email headers.
function clean_header(string $v): string {
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], '', $v));
}

$name    = field($data, 'name');
$email   = field($data, 'email');
$phone   = field($data, 'phone');
$service = field($data, 'service');
$message = field($data, 'message');
$company = field($data, 'company'); // honeypot

/* ---- Honeypot: pretend success so bots don't retry ------------------------ */
if ($company !== '') {
    respond(true);
}

/* ---- Validation ----------------------------------------------------------- */
$errors = [];
if ($name === '' || mb_strlen($name) > 120) {
    $errors[] = 'name';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}
if ($message === '' || mb_strlen($message) > 5000) {
    $errors[] = 'message';
}
if (!empty($errors)) {
    respond(false, 'Please check: ' . implode(', ', $errors) . '.', 422);
}

/* ---- Build the email ------------------------------------------------------ */
$safeName    = clean_header($name);
$safeEmail   = clean_header($email);
$safeService = clean_header($service !== '' ? $service : 'General enquiry');

$subject = sprintf('[Website] %s — %s', $BRAND, $safeService);

$bodyLines = [
    'New enquiry from the ' . $BRAND . ' website',
    str_repeat('-', 48),
    'Name:    ' . $name,
    'Email:   ' . $email,
    'Phone:   ' . ($phone !== '' ? $phone : '—'),
    'Service: ' . ($service !== '' ? $service : 'General enquiry'),
    '',
    'Message:',
    $message,
    '',
    str_repeat('-', 48),
    'Sent: ' . date('Y-m-d H:i:s') . ' (server time)',
    'IP:   ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
];
$body = implode("\n", $bodyLines);

/* From our own domain for deliverability; Reply-To is the visitor. */
$headers = [
    'From: ' . $BRAND . ' <' . $FROM . '>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

/* ---- Send ----------------------------------------------------------------- */
$sent = @mail($TO, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true);
}
respond(false, 'The message could not be sent. Please email us directly.', 500);
