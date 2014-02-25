$('body').on('click', 'input[type="submit"][confirmation]', function (event) {
	var $this = $(this);
	if (!$this.hasClass('confirming'))
	{
		var original_value = $this.val();
		$this.val($this.attr('confirmation'));

		$this.addClass('confirming');

		$this.mouseleave(function () {
			$this.val(original_value);
			$this.removeClass('confirming');
		});

		event.preventDefault();
	}
});
