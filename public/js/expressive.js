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
$('body').on('keyup', '[name="damn-robots"]', function(event) {
	var $this = $(this);
	$this.closest('form').find('input[type="submit"]').prop (
		'disabled', (btoa($this.val().trim().toLowerCase()) !== 'eWVsbG93')
	);
});
