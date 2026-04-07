import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const REQUIRED_COMMAND = 'npm start';
const AUTO_START_SECONDS = 3;
const FLOW_TIMINGS = {
  preloadIntervalMs: 35,
  preloadStep: 10,
  preloadToIntroDelayMs: 120,
  introCharMs: 10,
  introLinePauseMs: 80,
  introStartDelayMs: 120,
  loadingIntervalMs: 45,
  loadingStep: 20,
  loadingToBootDelayMs: 120,
  autoTriggerDelayMs: 120,
  bootCharMs: 10,
  bootLinePauseMs: 70,
  bootStartDelayMs: 100,
  closingDelayMs: 280,
  redirectDelayMs: 140,
  openAnimationMs: 180,
  closeAnimationMs: 280,
};

const TerminalPage = () => {
  const router = useRouter();
  const [command, setCommand] = useState('');
  const [phase, setPhase] = useState('preload');
  const [logs, setLogs] = useState([]);
  const [linhaDigitando, setLinhaDigitando] = useState('');
  const [progressoInicial, setProgressoInicial] = useState(0);
  const [progressoProjeto, setProgressoProjeto] = useState(0);
  const [mostrarTerminal, setMostrarTerminal] = useState(false);
  const [tentativasInvalidas, setTentativasInvalidas] = useState(0);
  const [contadorAutoInicio, setContadorAutoInicio] = useState(AUTO_START_SECONDS);
  const terminalScrollRef = useRef(null);

  const introSequence = useMemo(
    () => [
      '[SISTEMA] terminal iniciado',
      '[INFO] iniciando acesso ao portfolio...',
    ],
    []
  );

  const bootSequence = useMemo(
    () => [
      '[BOOT] npm start detectado',
      '[BUILD] compilando paginas... ok',
      '[BUILD] gerando assets... ok',
      '[PRONTO] abrindo /home',
    ],
    []
  );

  const iniciarProjeto = useCallback((origem = 'manual') => {
    if (phase !== 'idle') return;

    if (origem === 'atalho') {
      setLogs((current) => [...current, '[SISTEMA] comando sera executado automaticamente.']);
    }

    if (origem === 'auto') {
      setLogs((current) => [...current, '[SISTEMA] executando npm start automaticamente.']);
    }

    setLogs((current) => [...current, `$ ${REQUIRED_COMMAND}`]);
    setLogs((current) => [...current, '[SISTEMA] inicializando projeto...']);
    setTentativasInvalidas(0);
    setContadorAutoInicio(AUTO_START_SECONDS);
    setCommand('');
    setProgressoProjeto(0);
    setPhase('loadingProject');
  }, [phase]);

  useEffect(() => {
    if (phase !== 'preload') return undefined;

    const timer = setInterval(() => {
      setProgressoInicial((current) => {
        const next = Math.min(current + FLOW_TIMINGS.preloadStep, 100);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setMostrarTerminal(true);
            setPhase('intro');
          }, FLOW_TIMINGS.preloadToIntroDelayMs);
        }

        return next;
      });
    }, FLOW_TIMINGS.preloadIntervalMs);

    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'intro') return undefined;

    let cancelled = false;
    let lineIndex = 0;
    let charIndex = 0;

    const typeNext = () => {
      if (cancelled) return;

      const line = introSequence[lineIndex];

      if (charIndex < line.length) {
        setLinhaDigitando(line.slice(0, charIndex + 1));
        charIndex += 1;
        setTimeout(typeNext, FLOW_TIMINGS.introCharMs);
        return;
      }

      setLogs((current) => [...current, line]);
      setLinhaDigitando('');
      lineIndex += 1;
      charIndex = 0;

      if (lineIndex >= introSequence.length) {
        setPhase('idle');
        return;
      }

      setTimeout(typeNext, FLOW_TIMINGS.introLinePauseMs);
    };

    const startTimer = setTimeout(typeNext, FLOW_TIMINGS.introStartDelayMs);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [introSequence, phase]);

  useEffect(() => {
    if (phase !== 'loadingProject') return undefined;

    const timer = setInterval(() => {
      setProgressoProjeto((current) => {
        const next = Math.min(current + FLOW_TIMINGS.loadingStep, 100);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setLogs((currentLogs) => [...currentLogs, '[SISTEMA] modulos carregados']);
            setPhase('booting');
          }, FLOW_TIMINGS.loadingToBootDelayMs);
        }

        return next;
      });
    }, FLOW_TIMINGS.loadingIntervalMs);

    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'idle') return undefined;

    const timer = setInterval(() => {
      setContadorAutoInicio((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setLogs((currentLogs) => [
            ...currentLogs,
            '[SISTEMA] tempo limite atingido. Inicializacao automatica em andamento...',
          ]);
          setTimeout(() => {
            iniciarProjeto('auto');
          }, FLOW_TIMINGS.autoTriggerDelayMs);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [iniciarProjeto, phase]);

  useEffect(() => {
    if (phase !== 'booting') return undefined;

    let cancelled = false;
    let lineIndex = 0;
    let charIndex = 0;

    const typeNext = () => {
      if (cancelled) return;

      const line = bootSequence[lineIndex];

      if (charIndex < line.length) {
        setLinhaDigitando(line.slice(0, charIndex + 1));
        charIndex += 1;
        setTimeout(typeNext, FLOW_TIMINGS.bootCharMs);
        return;
      }

      setLogs((current) => [...current, line]);
      setLinhaDigitando('');
      lineIndex += 1;
      charIndex = 0;

      if (lineIndex >= bootSequence.length) {
        setPhase('closing');
        return;
      }

      setTimeout(typeNext, FLOW_TIMINGS.bootLinePauseMs);
    };

    const startTimer = setTimeout(typeNext, FLOW_TIMINGS.bootStartDelayMs);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [bootSequence, phase]);

  useEffect(() => {
    if (phase !== 'closing') return undefined;

    setLogs((current) => [...current, '[SISTEMA] encerrando interface...']);
    const timer = setTimeout(() => {
      setPhase('redirecting');
    }, FLOW_TIMINGS.closingDelayMs);

    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'redirecting') return undefined;

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        document.cookie = 'pl_done=true; Path=/; Max-Age=31536000; SameSite=Lax';
      }
      router.push('/home');
    }, FLOW_TIMINGS.redirectDelayMs);

    return () => clearTimeout(timer);
  }, [phase, router]);

  useEffect(() => {
    const terminalScroll = terminalScrollRef.current;
    if (!terminalScroll) return;

    terminalScroll.scrollTop = terminalScroll.scrollHeight;
  }, [logs, linhaDigitando, progressoProjeto, phase]);

  const handleRunCommand = (event) => {
    event.preventDefault();

    if (phase === 'preload' || phase === 'intro' || phase === 'loadingProject' || phase === 'booting' || phase === 'closing' || phase === 'redirecting') return;
    const comandoNormalizado = command.trim().toLowerCase();

    if (comandoNormalizado && comandoNormalizado !== REQUIRED_COMMAND) {
      const proximaTentativa = tentativasInvalidas + 1;
      setTentativasInvalidas(proximaTentativa);

      if (proximaTentativa >= 2) {
        setLogs((current) => [
          ...current,
          '[SISTEMA] comando invalido detectado mais de uma vez.',
          '[SISTEMA] executando npm start automaticamente...',
        ]);
        setCommand('');
        setTimeout(() => {
          iniciarProjeto('atalho');
        }, FLOW_TIMINGS.autoTriggerDelayMs);
        return;
      }

      setLogs((current) => [
        ...current,
        `[ERRO] comando invalido: ${command || '(vazio)'}`,
        `[DICA] use: ${REQUIRED_COMMAND}`,
      ]);
      setCommand('');
      return;
    }

    iniciarProjeto('manual');
  };

  return (
    <>
      <Head>
        <title>Terminal de Inicializacao | Juliano</title>
        <meta
          name="description"
          content="Landing imersiva em formato de terminal para iniciar o portfolio com npm start."
        />
      </Head>

      <main className="relative min-h-[100svh] overflow-hidden bg-[#0a120c] text-[#9df4b8]">
        <div className="grid-pattern pointer-events-none absolute inset-0 opacity-40" />
        <div className="crt-overlay pointer-events-none absolute inset-0 z-50" />

        {phase === 'preload' ? (
            <div className="relative z-10 mx-auto flex h-[100svh] w-full max-w-lg items-center justify-center border-x border-[#295138]/70 bg-[#0d1810] px-5 md:my-6 md:h-[72vh] md:max-h-[680px] md:rounded-xl md:border">
            <div className="w-full max-w-md space-y-4 font-mono">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7ad091]">carregando ambiente do sistema</p>
              <div className="h-2 w-full overflow-hidden rounded border border-[#295138] bg-[#0a1a11]">
                <div className="h-full bg-[#9df4b8] transition-all" style={{ width: `${progressoInicial}%` }} />
              </div>
              <p className="text-xs text-[#89dd9f]">{progressoInicial}%</p>
            </div>
          </div>
        ) : null}

        {phase !== 'preload' ? <div className={`cyberpunk-shell relative z-10 mx-auto flex h-[100svh] w-full max-w-lg flex-col overflow-hidden border-x border-[#295138]/70 bg-[#0d1810] md:my-6 md:h-[72vh] md:max-h-[680px] md:rounded-xl md:border ${mostrarTerminal ? 'os-open' : 'os-hidden'} ${phase === 'closing' || phase === 'redirecting' ? 'os-close' : ''}`}>
          <header className="flex items-center justify-between border-b border-[#295138]/70 bg-[#13ec5b]/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/50" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <span className="h-3 w-3 rounded-full bg-[#13ec5b]/60" />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7ad091]">terminal - zsh - 80x24</p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7ad091]/80">convidado@portfolio</p>
          </header>

          <div ref={terminalScrollRef} className="terminal-scroll flex-1 space-y-2 overflow-y-auto px-4 py-4 font-mono text-sm">
            <p className="text-[#b8ffcf]">README.md</p>
            <p className="text-[#89dd9f]">Execute <strong>npm start</strong> para abrir o site.</p>
            {logs.map((line, index) => (
              <p key={`${line}-${index}`} className="text-[#7ad091]">
                {line.includes(REQUIRED_COMMAND) ? (
                  <>
                    {line.split(REQUIRED_COMMAND)[0]}
                    <strong>{REQUIRED_COMMAND}</strong>
                    {line.split(REQUIRED_COMMAND).slice(1).join(REQUIRED_COMMAND)}
                  </>
                ) : (
                  line
                )}
              </p>
            ))}
            {linhaDigitando ? (
              <p className="text-[#7ad091]">
                {linhaDigitando}
                <span aria-hidden="true" className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-[#9df4b8]" />
              </p>
            ) : null}
            {phase === 'loadingProject' ? (
              <div className="mt-2 space-y-2">
                <p className="text-[#89dd9f]">[PROGRESSO] inicializando modulo principal...</p>
                <div className="h-2 w-full overflow-hidden rounded border border-[#295138] bg-[#0a1a11]">
                  <div className="h-full bg-[#9df4b8] transition-all" style={{ width: `${progressoProjeto}%` }} />
                </div>
                <p className="text-xs text-[#89dd9f]">{progressoProjeto}%</p>
              </div>
            ) : null}
            {phase === 'redirecting' ? <p className="glitch-text mt-3 text-[#b8ffcf]">[FALHA] redirecionando para /home</p> : null}

            {phase === 'idle' ? (
              <div className="mt-4 rounded border border-[#295138] bg-[#0a1a11]/80 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[#89dd9f]">
                  [SISTEMA] auto-inicio em <strong>{contadorAutoInicio}s</strong> - digite <strong>npm start</strong> ou aguarde.
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-[#0b130e]">
                  <div
                    className="h-full bg-[#8cf5b0] transition-all"
                     style={{ width: `${((AUTO_START_SECONDS - contadorAutoInicio) / AUTO_START_SECONDS) * 100}%` }}
                   />
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleRunCommand} className="flex items-center gap-2 border-t border-[#295138]/70 bg-[#07140d] px-4 py-3">
            <span className="font-mono text-sm text-[#9df4b8]">$</span>
            <input
              autoFocus
              className="flex-1 bg-transparent font-mono text-sm text-[#ceffdd] caret-[#9df4b8] outline-none placeholder:text-[#4ea96b]"
              placeholder="npm start"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              disabled={phase === 'preload' || phase === 'intro' || phase === 'loadingProject' || phase === 'booting' || phase === 'closing' || phase === 'redirecting'}
            />
            <button
              type="submit"
              className="rounded border border-[#3f9a5c] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#bfffd2] transition hover:bg-[#0f2417] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={phase === 'preload' || phase === 'intro' || phase === 'loadingProject' || phase === 'booting' || phase === 'closing' || phase === 'redirecting'}
            >
              executar
            </button>
          </form>
        </div> : null}

        <style jsx>{`
          .crt-overlay {
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
              linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
            background-size: 100% 2px, 3px 100%;
          }

          .grid-pattern {
            background-image: radial-gradient(circle, rgba(19, 236, 91, 0.12) 1px, transparent 1px);
            background-size: 30px 30px;
          }

          .cyberpunk-shell {
            box-shadow: 0 0 0 1px rgba(157, 244, 184, 0.08), 0 0 24px rgba(32, 122, 66, 0.45), inset 0 0 36px rgba(35, 112, 63, 0.15);
            animation: flicker 4s linear infinite;
          }

          .os-hidden {
            opacity: 0;
            transform: scale(0.97);
            pointer-events: none;
          }

          .os-open {
            animation: osOpen ${FLOW_TIMINGS.openAnimationMs}ms ease-out forwards, flicker 4s linear infinite;
          }

          .os-close {
            animation: osClose ${FLOW_TIMINGS.closeAnimationMs}ms ease-in forwards;
          }

          .glitch-text {
            position: relative;
            animation: glitch 0.4s steps(2, end) infinite;
          }

          .terminal-scroll {
            scrollbar-width: thin;
            scrollbar-color: #7ad09144 #08140d;
          }

          .terminal-scroll::-webkit-scrollbar {
            width: 10px;
          }

          .terminal-scroll::-webkit-scrollbar-track {
            background: #08140d;
            border-left: 1px solid #295138;
          }

          .terminal-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #8cf5b0aa 0%, #59b97aaa 100%);
            border: 2px solid #08140d;
            border-radius: 999px;
            box-shadow: 0 0 10px rgba(122, 208, 145, 0.35);
          }

          .terminal-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #a6ffc5cc 0%, #6bcc8bcc 100%);
          }

          .glitch-text::before,
          .glitch-text::after {
            content: '[FALHA] redirecionando para /home';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            overflow: hidden;
          }

          .glitch-text::before {
            color: #7efff1;
            transform: translate(-1px, 0);
            opacity: 0.7;
          }

          .glitch-text::after {
            color: #ff6c8b;
            transform: translate(1px, 0);
            opacity: 0.6;
          }

          @keyframes flicker {
            0%,
            19%,
            21%,
            62%,
            64%,
            100% {
              opacity: 1;
            }
            20%,
            63% {
              opacity: 0.96;
            }
          }

          @keyframes osOpen {
            from {
              opacity: 0;
              transform: scale(0.96);
              filter: blur(2px);
            }
            to {
              opacity: 1;
              transform: scale(1);
              filter: blur(0);
            }
          }

          @keyframes osClose {
            0% {
              opacity: 1;
              transform: scale(1);
              filter: blur(0);
            }
            50% {
              opacity: 0.55;
              transform: scale(1.01);
              filter: blur(1px);
            }
            100% {
              opacity: 0;
              transform: scale(0.94);
              filter: blur(4px);
            }
          }

          @keyframes glitch {
            0% {
              transform: translate(0, 0);
            }
            25% {
              transform: translate(-1px, 1px);
            }
            50% {
              transform: translate(1px, -1px);
            }
            75% {
              transform: translate(1px, 1px);
            }
            100% {
              transform: translate(0, 0);
            }
          }
        `}</style>
      </main>
    </>
  );
};

export default TerminalPage;
