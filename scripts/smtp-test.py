#!/usr/bin/env python3
"""Aderion SMTP login tester. Run it on YOUR computer; the password is typed
into a hidden prompt and is never printed, logged or sent anywhere except to
the mail server you point it at.

    python scripts/smtp-test.py                 # tries AUTH PLAIN, then AUTH LOGIN
    python scripts/smtp-test.py --send          # also sends one test mail (to itself) after a successful login
    python scripts/smtp-test.py --port 587 --starttls

Why: when the website answers "Bir hata oluştu", this tells you whether the
mailbox + password work from outside the website (then the problem is the
copy of the password inside api/smtp_config.php on the server) or whether the
mail server itself rejects them (then the mailbox/password is the problem).
It makes at most two login attempts, so it will not trigger brute-force blocks.
"""
import argparse, base64, getpass, socket, ssl, sys


class Conn:
    def __init__(self, host, port, starttls, no_tls):
        self.ctx = ssl.create_default_context()
        raw = socket.create_connection((host, port), timeout=15)
        self.sock = raw if (starttls or no_tls) else self.ctx.wrap_socket(raw, server_hostname=host)
        self.f = self.sock.makefile('rwb', buffering=0)
        self.read()
        self.cmd('EHLO smtp-test.local', show=False)
        if starttls:
            self.cmd('STARTTLS')
            self.sock = self.ctx.wrap_socket(self.sock, server_hostname=host)
            self.f = self.sock.makefile('rwb', buffering=0)
            self.cmd('EHLO smtp-test.local', show=False)

    def read(self):
        lines = []
        while True:
            line = self.f.readline().decode('utf-8', 'replace').rstrip()
            lines.append(line)
            if len(line) < 4 or line[3] == ' ':
                return lines

    def cmd(self, text, show=True):
        self.f.write((text + '\r\n').encode())
        reply = self.read()
        if show:
            print('  <-', reply[-1])
        return reply[-1]

    def close(self):
        try:
            self.cmd('QUIT', show=False)
            self.sock.close()
        except OSError:
            pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--host', default='mail.aderionstudios.com')
    ap.add_argument('--port', type=int, default=465)
    ap.add_argument('--starttls', action='store_true', help='STARTTLS (port 587) instead of implicit TLS (465)')
    ap.add_argument('--no-tls', action='store_true', help='plain connection (only for local tests)')
    ap.add_argument('--user', default='contact@aderionstudios.com')
    ap.add_argument('--send', action='store_true', help='send one test mail (user -> user) after a successful login')
    a = ap.parse_args()

    password = getpass.getpass(f'Password for {a.user} (hidden): ')
    notes = []
    if password != password.strip():
        notes.append('leading/trailing whitespace')
    if not password.isascii():
        notes.append('non-ASCII characters')
    if "'" in password or '\\' in password:
        notes.append("contains ' or \\ -> must be escaped inside api/smtp_config.php (or avoid them)")
    print(f'(password length: {len(password)}' + (('; WARNING: ' + '; '.join(notes)) if notes else '') + ')')

    ok_method = None
    for method in ('PLAIN', 'LOGIN'):
        print(f'\nAUTH {method} -> {a.host}:{a.port}')
        c = Conn(a.host, a.port, a.starttls, a.no_tls)
        if method == 'PLAIN':
            token = base64.b64encode(b'\0' + a.user.encode() + b'\0' + password.encode()).decode()
            reply = c.cmd('AUTH PLAIN ' + token)
        else:
            c.cmd('AUTH LOGIN')
            c.cmd(base64.b64encode(a.user.encode()).decode())
            reply = c.cmd(base64.b64encode(password.encode()).decode())
        ok = reply.startswith('235')
        print('  RESULT:', 'LOGIN OK' if ok else 'LOGIN REJECTED')
        if ok:
            ok_method = method
            if a.send:
                c.cmd(f'MAIL FROM:<{a.user}>')
                c.cmd(f'RCPT TO:<{a.user}>')
                c.cmd('DATA')
                c.cmd(f'From: {a.user}\r\nTo: {a.user}\r\nSubject: Aderion SMTP test\r\n\r\nSMTP login works.\r\n.')
                print('  (test mail submitted)')
        c.close()
        if ok:
            break

    print('\n=== SUMMARY ===')
    if ok_method:
        print(f'The mailbox and password WORK from outside the website (AUTH {ok_method}).')
        print('=> The problem is the password copy inside api/smtp_config.php on the server (typo, quote/backslash,')
        print('   old file, wrong folder), or the web server cannot reach the mail host.')
        return 0
    print('The mail server REJECTS this username/password.')
    print('=> Re-set the password in cPanel > Email Accounts, make sure contact@aderionstudios.com exists,')
    print('   and confirm it works in webmail first.')
    return 1


if __name__ == '__main__':
    sys.exit(main())
