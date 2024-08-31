(function() {
    const element = document.querySelector('.et_pb_row_0_tb_header');

    const logRect = () => {
        if (element) {
            const rect = element.getBoundingClientRect();
            console.log('Rect:', rect);
        } else {
            console.log('Element not found');
        }
    };

    const intervalId = setInterval(logRect, 100);
})();