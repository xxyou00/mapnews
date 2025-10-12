function initializeSliders() {
    document.querySelectorAll('.slider__bottom').forEach(slider => {
        const slidesContainer = slider.querySelector('.slides-container');
        const slides = slider.querySelector('.slides');
        const prevButton = slider.querySelector('.prev-btn');
        const nextButton = slider.querySelector('.next-btn');

        let currentOffset = 0; 
        const scrollAmount = 740;
        let isMouseDown = false;
        let startX = 0;
        let scrollStart = 0;

        function getVisibleWidth() {
            return slidesContainer.offsetWidth;
        }

        function updateButtons() {
            prevButton.disabled = currentOffset === 0;
            nextButton.disabled = currentOffset >= slides.scrollWidth - getVisibleWidth();
        }

        prevButton.addEventListener('click', () => {
            const newOffset = Math.max(currentOffset - scrollAmount, 0);
            currentOffset = newOffset;
            slides.style.transform = `translateX(-${currentOffset}px)` ;
            updateButtons();
        });

        nextButton.addEventListener('click', () => {
            const maxOffset = slides.scrollWidth - getVisibleWidth();
            const newOffset = Math.min(currentOffset + scrollAmount, maxOffset);
            currentOffset = newOffset;
            slides.style.transform = `translateX(-${currentOffset}px)`;
            updateButtons();
        });

        function initializeSlider() {
            currentOffset = 0;
            slides.style.transform = `translateX(-${currentOffset}px)`;
            updateButtons();
        }

        slidesContainer.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.pageX;
            scrollStart = currentOffset;
            slidesContainer.style.cursor = 'grabbing';
        });

        slidesContainer.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;

            const distance = e.pageX - startX;
            currentOffset = scrollStart - distance;

            const maxOffset = slides.scrollWidth - getVisibleWidth();
            currentOffset = Math.max(0, Math.min(currentOffset, maxOffset));

            slides.style.transform = `translateX(-${currentOffset}px)`;
            updateButtons();
        });

        slidesContainer.addEventListener('mouseup', () => {
            isMouseDown = false;
            slidesContainer.style.cursor = 'grab';
        });

        slidesContainer.addEventListener('mouseleave', () => {
            isMouseDown = false;
            slidesContainer.style.cursor = 'grab';
        });

        initializeSlider();

        window.addEventListener('resize', initializeSlider);
    });
}

window.initializeSliders = initializeSliders;