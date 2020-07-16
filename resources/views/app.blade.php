<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- Required meta tags -->
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<title>::Carela wasserhygine::</title>
		<link rel="stylesheet" href="{{ asset('css/bootstrap.min.css') }}">
		<!-- Custom styles for this template -->
		<link rel="stylesheet" href="{{ asset('css/style.css') }}">
		<!-- font-icon -->
		<link rel="stylesheet" type="text/css" href="{{ asset('css/font-awesome.min.css') }}">
		<!-- CUSTOM STYLE -->
		<!-- <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}"> -->
	</head>
	<body>  
		<div id="root"></div>
		<!-- Optional JavaScript -->
		<!-- jQuery first, then Popper.js, then Bootstrap JS -->
		<script src="{{ asset('js/jquery-3.3.1.slim.min.js') }}"></script>
		<script src="{{ asset('js/popper.min.js') }}"></script>
		<script src="{{ asset('js/bootstrap.min.js') }}"></script>
		
		<script>
			const token = '<?=session('token'); ?>';
			const role = '<?=session('role'); ?>';
			const name = '<?=auth()->user()->name; ?>';
			localStorage.setItem("name" , name);
			localStorage.setItem("token" , token);
			localStorage.setItem("role" , role);
		</script>
		<script src="{{ asset('js/app.js') }}"></script>
	</body>
</html>

