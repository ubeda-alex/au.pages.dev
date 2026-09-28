document.documentElement.classList.add('js');

(() => {

  const root =
    document.documentElement;

  const reduced =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  const finePointer =
    window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;


  /* =========================
     AÑO AUTOMÁTICO
  ========================= */

  const year =
    document.getElementById('year');

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* =========================
     BARRA DE SCROLL
  ========================= */

  const progress =
    document.querySelector(
      '.scroll-progress span'
    );


  const updateProgress = () => {

    const max =
      document.documentElement.scrollHeight -
      window.innerHeight;


    const value =
      max > 0
        ? window.scrollY / max
        : 0;


    if (progress) {

      progress.style.transform =
        `scaleX(${
          Math.min(
            1,
            Math.max(0, value)
          )
        })`;

    }

  };


  updateProgress();


  window.addEventListener(
    'scroll',
    updateProgress,
    {
      passive: true
    }
  );


  window.addEventListener(
    'resize',
    updateProgress,
    {
      passive: true
    }
  );


  /* =========================
     APARICIÓN AL HACER SCROLL
  ========================= */

  if (!reduced) {

    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target
                  .classList
                  .add('is-visible');


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },

        {
          threshold: 0.13,

          rootMargin:
            '0px 0px -4% 0px'
        }

      );


    document
      .querySelectorAll('.reveal')
      .forEach(
        (el, index) => {

          el.style.transitionDelay =
            `${
              Math.min(
                index % 4,
                3
              ) * 70
            }ms`;


          observer.observe(el);

        }
      );

  }

  else {

    document
      .querySelectorAll('.reveal')
      .forEach(
        (el) =>
          el.classList
            .add('is-visible')
      );

  }


  /* =========================
     EFECTOS CON MOUSE
  ========================= */

  if (
    finePointer &&
    !reduced
  ) {

    let pointerX =
      window.innerWidth / 2;

    let pointerY =
      window.innerHeight / 4;

    let ticking =
      false;


    /*
       Movimiento global del fondo.
    */

    const paintPointer = () => {

      const nx =
        pointerX /
        window.innerWidth;


      const ny =
        pointerY /
        window.innerHeight;


      root.style.setProperty(
        '--mx',
        `${(
          nx * 100
        ).toFixed(2)}%`
      );


      root.style.setProperty(
        '--my',
        `${(
          ny * 100
        ).toFixed(2)}%`
      );


      root.style.setProperty(
        '--dx',
        (
          (nx - 0.5) * 2
        ).toFixed(3)
      );


      root.style.setProperty(
        '--dy',
        (
          (ny - 0.5) * 2
        ).toFixed(3)
      );


      ticking = false;

    };


    window.addEventListener(

      'pointermove',

      (event) => {

        pointerX =
          event.clientX;

        pointerY =
          event.clientY;


        if (!ticking) {

          requestAnimationFrame(
            paintPointer
          );

          ticking = true;

        }

      },

      {
        passive: true
      }

    );


    /* =========================
       EFECTO TILT 3D
    ========================= */

    document
      .querySelectorAll(
        '[data-tilt]'
      )
      .forEach(
        (card) => {

          const strength =
            Number(
              card.dataset
                .tiltStrength || 3
            );


          card.addEventListener(

            'pointermove',

            (event) => {

              const rect =
                card
                  .getBoundingClientRect();


              const px =
                (
                  event.clientX -
                  rect.left
                ) /
                rect.width -
                0.5;


              const py =
                (
                  event.clientY -
                  rect.top
                ) /
                rect.height -
                0.5;


              card.style.transform =
                `
                  perspective(950px)
                  rotateX(${
                    (
                      -py *
                      strength
                    ).toFixed(2)
                  }deg)
                  rotateY(${
                    (
                      px *
                      strength
                    ).toFixed(2)
                  }deg)
                  translateY(-2px)
                `;

            }

          );


          card.addEventListener(

            'pointerleave',

            () => {

              card.style.transform =
                '';

            }

          );

        }
      );


    /* =========================
       ÓRBITA 3D DEL RETRATO
    ========================= */

    const portrait =
      document.querySelector(
        '.portrait-wrap'
      );


    if (portrait) {

      portrait.addEventListener(

        'pointermove',

        (event) => {

          const rect =
            portrait
              .getBoundingClientRect();


          const px =
            (
              event.clientX -
              rect.left
            ) /
            rect.width -
            0.5;


          const py =
            (
              event.clientY -
              rect.top
            ) /
            rect.height -
            0.5;


          /*
             La parte de atrás se mueve
             ligeramente en dirección
             contraria.

             Esto la hace sentirse
             más profunda.
          */

          portrait.style.setProperty(
            '--orbit-back-x',
            `${
              (
                px * -8
              ).toFixed(1)
            }px`
          );


          portrait.style.setProperty(
            '--orbit-back-y',
            `${
              (
                py * -5
              ).toFixed(1)
            }px`
          );


          /*
             La parte delantera se mueve
             ligeramente hacia el cursor.

             Eso refuerza la sensación
             de que está delante.
          */

          portrait.style.setProperty(
            '--orbit-front-x',
            `${
              (
                px * 10
              ).toFixed(1)
            }px`
          );


          portrait.style.setProperty(
            '--orbit-front-y',
            `${
              (
                py * 7
              ).toFixed(1)
            }px`
          );

        }

      );


      portrait.addEventListener(

        'pointerleave',

        () => {

          portrait.style.setProperty(
            '--orbit-back-x',
            '0px'
          );


          portrait.style.setProperty(
            '--orbit-back-y',
            '0px'
          );


          portrait.style.setProperty(
            '--orbit-front-x',
            '0px'
          );


          portrait.style.setProperty(
            '--orbit-front-y',
            '0px'
          );

        }

      );

    }


    /* =========================
       BOTONES MAGNÉTICOS
    ========================= */

    document
      .querySelectorAll(
        '.magnetic'
      )
      .forEach(
        (el) => {

          el.addEventListener(

            'pointermove',

            (event) => {

              const rect =
                el
                  .getBoundingClientRect();


              const x =
                event.clientX -
                rect.left -
                rect.width / 2;


              const y =
                event.clientY -
                rect.top -
                rect.height / 2;


              el.style.transform =
                `translate(
                  ${
                    (
                      x * 0.1
                    ).toFixed(1)
                  }px,
                  ${
                    (
                      y * 0.12
                    ).toFixed(1)
                  }px
                )`;

            }

          );


          el.addEventListener(

            'pointerleave',

            () => {

              el.style.transform =
                '';

            }

          );

        }
      );

  }

})();