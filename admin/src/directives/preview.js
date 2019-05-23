import Vue from 'vue';
import ImgPreview from './ImgPreview';

export default {
  inserted(el) {
    const viewDiv = document.createElement('div');
    document.body.appendChild(viewDiv);
    const obj = new Vue({
      el: viewDiv,
      template: `
                  <ImgPreview 
                    v-if='show' 
                    :currentImg='currentImg' 
                    :show='show' 
                    @close='closePic'></ImgPreview>
                `,
      components: {
        ImgPreview,
      },
      data: {
        show: false,
        currentImg: '',
      },
      methods: {
        closePic() {
          this.show = false;
        },
      },
    });

    el.addEventListener('click', ($event) => {
      if ($event.target.localName === 'img') {
        $event.stopPropagation();
        $event.preventDefault();
        obj.show = true;
        obj.currentImg = $event.target.src;
        console.log(obj.show);
      }
    });
  },

};
