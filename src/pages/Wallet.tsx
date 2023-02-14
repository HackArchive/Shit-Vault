import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faUserPlus,faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { ethereum } from "../App";
import BigNumber from "bn.js"
import Web3 from "web3";
import * as PushAPI from "@pushprotocol/restapi";
import {ethers} from 'ethers';


const PKey = '0xe5875d5550484e5f20bfa8efe3976432890ba8e43f3b77dd37375f61c0acfc2d';
export const signer = new ethers.Wallet(PKey);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


export default function Wallet(){
    
    
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const [balance,setBalance] = useState<string>(); 
    const [address, setAddress] = useState<string>();
    const [feed,setFeed] = useState<Array<{title:string,message:string,icon:string}>>();


    const getInfo = async ()=>{
        const accounts:string[] = await web3.eth.getAccounts();
        const balance:string = await web3.eth.getBalance(accounts[0]);
        setAddress(accounts[0]);
        setBalance(web3.utils.fromWei(balance));
        
    }

    const getFeeds = async ()=>{
        while(true){
            const notifications = await PushAPI.user.getFeeds({
                user: 'eip155:5:0x375C11FD30FdC95e10aAD66bdcE590E1bccc6aFA', // user address in CAIP
                env: 'staging'
              });
              
              setFeed(notifications);
              sleep(5000);
        }
          
    }



    useEffect(()=>{
        getInfo();
        getFeeds();
    })

    return(
        
        <div className="w-[100vw] h-[100vh] bg-[#20223E] flex flex-col  items-center overflow-hidden">
            
            <div className=" justify-end w-full flex justify-end ">
                <div className="m-6 inline-flex relative w-fit">
                <div className="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-2.5 text-xs bg-pink-700 rounded-full z-10"></div>
                <div className="px-3 py-2 bg-indigo-400 flex items-center justify-center text-center rounded-lg shadow-lg">
                    <div>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bell" className="mx-auto text-white w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"></path>
                    </svg>
                    </div>
                </div>
                </div>
            </div>


            <div className="flex flex-col w-[60%] h-[40vh] items-center cursor-pointer">
                <p className="text-xl text-gray-400 font-extralight">TOTAL BALANCE</p>
                <p className="text-grey-700 text-5xl text-white mt-3 font-extralight">{balance} ETH</p>
                <div className="w-[150px] h-[50px] bg-green-600 bg-opacity-20  flex justify-center items-center rounded-md mt-5">
                    <p className="text-green-500 font-mono text-xl ">+ 500 ETH</p>
                </div>
                <div className="flex flex-wrap max-w-[80%] mt-10 justify-between">
                <button className="bg-blue-500 mx-5 px-4 py-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
                    <FontAwesomeIcon className="w-5 h-5 fill-current" icon={faUserPlus} />
                    <span>Add Recipent</span>
                </button>

                <button className="bg-red-500 mx-5 px-4 py-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
                    <FontAwesomeIcon className="w-5 h-5 fill-current" icon={faArrowUpRightFromSquare} />
                    <span>Send ETH</span>
                </button>
                <button className="bg-pink-600 mx-5 px-4 py-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
                    <FontAwesomeIcon className="w-5 h-5 fill-current" icon={faArrowDown} />
                    <span>Ask ETH</span>
                </button>
                
                </div>
            </div>


            <div className="flex flex-col w-[400px] max-h-[300px] overflow-y-scroll p-3 border-red-400 rounded-md  border-opacity-30 border">

                {
                    feed?.map((item)=>{
                        return (
                            <div key={item.message} className="w-full h-[60px] p-3 flex justify-between items-center text-white">
                                <div className="w-[80%] h-1/1 flex items-center">
                                    <div className="w-[15%]">
                                        <FontAwesomeIcon className="w-5 h-5 fill-current text-green-500" icon={faArrowUpRightFromSquare} />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-xl">{item.message}</div>
                                        <div className="text-sm text-gray-400">{item.title}</div>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center mr-3">
                                    <div className="text-green-500">+</div>
                                    <div className="">$840.20</div>
                                </div>
                            </div>
                        );
                    })
                }
                
            </div>

        </div>
    );

}