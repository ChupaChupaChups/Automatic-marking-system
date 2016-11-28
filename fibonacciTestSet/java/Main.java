import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		int fn = sc.nextInt();
		
		Main fibo = new Main();
		int result = fibo.fibo(fn);
		System.out.println(result);
	}
	
	public int fibo(int a) {
	
		if(a==0||a==1){
			return a;
		}
		else{
			return fibo(a-2)+fibo(a-1);
		}
		
	}

}
