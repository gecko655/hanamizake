package controllers;

import play.mvc.*;
import play.mvc.results.Redirect;

import models.*;

import java.util.*;
import java.io.*;

public class UsersController extends Application {
    
	@Before(unless={"logout","quit","quit_main"})
	private static void _no_session_auth(){
		no_session_auth();
    }
	
	@Before(only={"logout","quit","quit_main"})
	private static void _session_auth(){
		session_auth();
	}
	
    public static void index() {
        render();
    }
	
	public static void signup(){
		render();
	}
	
	public static void signup_main(){
		if(signup_confirm()){
			session.put("username",params.get("username"));
			signup_complete();
		}else{
			signup();
		}
	}
    
    public static void signup_complete(){
        render();
    }
	
	public static void login(){
		render();
	}
	
	public static void login_main(){
		if(UserData.login_confirm(params.get("username"), params.get("password"))){
			session.put("username",params.get("username"));
			MenuController.index();
		}else{
			params.flash();
			flash.put("error", "ユーザー名又はパスワードが間違っています");
			login();
		}
	}
    
    public static void login_complete(){
        render();
    }

	public static boolean signup_confirm(){	
		UserData user = new UserData(params.get("username"));
		user.password = params.get("password");
		validation.valid(user);
			
		if( validation.hasErrors() ){
			params.flash();
			validation.keep();
			return false;
		}
		
		if (!params.get("password").equals(params.get("password_confirm"))) {
			flash.put("password_confirm_error", "パスワード(確認)が一致しません");
			return false;
		}
		
		user.digest_password();
		user.save();
		return true;
		
		/*
		UserData confirm = UserData.find("username = ?", params.get("username")).first();
		if(confirm == null && !(params.get("password").equals("")) &&(params.get("password").length()>3)){
			UserData ud = new UserData(params.get("username"));
			String digest = getDigest(params.get("password"),ud.salt);
			ud.password=digest;
			ud.save();
			return 1;
		}else{
			return 0;
		}
		*/
	}
	
	
	public static void logout(){
		session.remove("username");
//		Application.index();　//継承元のコントローラーのアクションを呼ぶことはできない？
		redirect("/");
	}
	
	public static void quit_form(){
		render();
	}
	
	public static void quit(){
		UserData ud = UserData.find("username = ?", params.get("username")).first();
		ud.delete();
		session.remove("username");
		quit_complete();
	}
	
	public static void quit_complete(){
		render();
	}

}
