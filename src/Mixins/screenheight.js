export const screenHeight = {
    data() {
        return {
            screenHeight: 0,
            screenWidth: 0
        }
    },
    created() {
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
    },
    methods: {
        handleResize() {
            // if (window.innerHeight <= 300) {
            //     this.screenHeight = 300
            // } else {
            this.screenHeight = window.innerHeight
            this.screenWidth = window.innerWidth
                //}
        }
    }
}
