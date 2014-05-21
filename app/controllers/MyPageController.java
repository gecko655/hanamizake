package controllers;

import play.mvc.*;

import models.*;

import java.util.*;
import java.io.*;


public class MyPageController extends Application{
	
	@Before
	static void auth(){
        session_auth();
    }
	
	public static void password_change_form(){
		render();
	}
	
	public static void password_change(String old_password, String new_password, String confirm_new_password){
		UserData current_user = (UserData)renderArgs.get("current_user");
		
		if ( current_user.check_password(old_password) == false ){
			flash.put("invalid_password", "パスワードが違います");
			password_change_form();
		}else if ( !new_password.equals(confirm_new_password) ) {
			flash.put("invalid_new_password", "新しパスワード(確認)が一致しません");
			password_change_form();
		}
		
		current_user.password = new_password;
		validation.valid(current_user);
			
		if( validation.hasErrors() ){
			current_user.refresh();
			validation.keep();
			password_change_form();
		}else{
			current_user.digest_password();
			current_user.save();
			password_change_complete();
		}
/*		
		if(UsersController.login_confirm(params)>0){
			UserData ud = UserData.find("username = ?", params.get("username")).first();
			ud.password = UsersController.getDigest(params.get("newpassword"),ud.salt);
			ud.save();
			password_change_complete();
		}else{
			password_change_form();
		}
*/
	}
	
	public static void password_change_complete(){
		render();
	}
	
	public static void index(){
		render();
	}
	
	public static void history(){
		UserData current_user = (UserData)renderArgs.get("current_user");
		List<History> histories = History.find("byUserdata_Id", current_user.id).fetch();
		render(histories);
	}
	
	public static void history_detail(){
		render();
	}

	

}

