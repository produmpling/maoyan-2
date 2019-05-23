/* ============
 * checkForm Mixin
 * ============
 *
 * Mixins are used to easily expand Vue components.
 * This slot-mixin, will add the checkForm-method
 * to the specified Vue component.
 */
export default {
  /**
   * The methods that the mixin will add.
   */
  methods: {
    /**
     * 配合elementUI的表单校验
     * @param  {[type]} formName 表单名
     * @return {[type]}          是否过校验
     */
    CheckForm(formName) {
      let checkResult = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          checkResult = true;
        } else {
          checkResult = false;
        }
      });

      return checkResult;
    },
    /**
     * 配合elementUI的**单项**表单校验
     * @param {[type]} formName    表单名
     * @param {[type]} modelName   是否过校验
     */
    validateSingleItem(formName, modelName) {
      this.$refs[formName].validateField(modelName);
    },
  },
};
