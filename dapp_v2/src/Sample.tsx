import { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import { ERC20_ABI_DPOLLS } from '@/constants/abi'
import { CONTRACT_ADDRESSES } from '@/constants/contracts'
// import CreateTokenFactory from '@/abis/ERC20/CreateTokenFactory.json'
import { useEthersSigner, useSignature, useSendUserOp } from '@/hooks'

export const getSigner = async () => {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install MetaMask.");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log("Connected wallet address:", await signer.getAddress());
  return signer;
};

const Sample = () => {
  const { AAaddress, isConnected } = useSignature()
  const { execute, waitForUserOpResult, checkUserOpStatus } = useSendUserOp()
  const signer = useEthersSigner();
  console.log('ethers signer', signer)

  const [isLoading, setIsLoading] = useState(false)
  const [userOpHash, setUserOpHash] = useState<string | null>(null)
  const [txStatus, setTxStatus] = useState<string>('')
  const [isPolling, setIsPolling] = useState(false)

  useEffect(() => {
    let intervalId: number | null = null

    const pollStatus = async () => {
      if (!userOpHash || !isPolling) return

      try {
        const status = await checkUserOpStatus(userOpHash)
        if (status === true) {
          setTxStatus('成功しました！')
          setIsPolling(false)
        } else {
          setTxStatus('失敗しました')
          setIsPolling(false)
        }
      } catch (error) {
        console.error('ステータス確認エラー:', error)
        setTxStatus('エラーが発生しました')
        setIsPolling(false)
      }
    }

    if (userOpHash && isPolling) {
      setTxStatus('処理中...')
      intervalId = window.setInterval(pollStatus, 3000) as unknown as number // 3秒ごとにステータスを確認
      pollStatus()
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [userOpHash, isPolling, checkUserOpStatus])

  const handleExecute = async () => {
    if (!isConnected) {
      alert('not connected')
      return
    }

    const signer2 = await getSigner();
    console.log('signer2', signer2)

    setIsLoading(true)
    setUserOpHash(null)
    setTxStatus('')

    const pollForm = {
      subject: 'Sample Poll',
      options: ['Option 1', 'Option 2', 'Option 3'],
      rewardPerResponse: 1,
      duration: 10, // 1 hour
      maxResponses: 10,
    }

    try {
      const amountInWei = ethers.utils.parseEther("0.1");
      // const erc20 = new ethers.Contract(
      //   CONTRACT_ADDRESSES.dpollsContract,
      //   ERC20_ABI_DPOLLS,
      //   signer
      // );
      // await erc20.approve(
      //   CONTRACT_ADDRESSES.dpollsContract,
      //   amountInWei);
      await execute({
        function: 'approve',
        contractAddress: CONTRACT_ADDRESSES.dpollsContract,
        abi: ERC20_ABI_DPOLLS,
        value: 0,
        params: [signer?.getAddress(), amountInWei],
      })
      
      await execute({
        function: 'createPoll',
        contractAddress: CONTRACT_ADDRESSES.dpollsContract,
        abi: ERC20_ABI_DPOLLS,
        value: 0,
        params: [
          pollForm.subject,
          pollForm.options,
          pollForm.rewardPerResponse,
          pollForm.duration,
          pollForm.maxResponses
        ],
      })

      // await execute({
      //   function: 'createToken',
      //   contractAddress: '0x00ef47f5316A311870fe3F3431aA510C5c2c5a90',
      //   abi: CreateTokenFactory.abi,
      //   params: ['test', 'aiueo', '100000000'],
      // })

      const result = await waitForUserOpResult()
      setUserOpHash(result.userOpHash)

      setIsPolling(true)

      if (result.result === true) {
        setTxStatus('成功しました！')
        setIsPolling(false)
      } else if (result.transactionHash) {
        setTxStatus('トランザクションハッシュ: ' + result.transactionHash)
      }
    } catch (error) {
      console.error('実行エラー:', error)
      setTxStatus('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: '40px 30px',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '1.2rem',
          marginBottom: '20px',
          color: '#333',
        }}
      >
        {AAaddress}
      </p>
      <button
        onClick={handleExecute}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
        }}
      >
        {isLoading ? '実行中...' : 'Sample send userOp'}
      </button>

      {userOpHash && (
        <div style={{ marginTop: '20px', maxWidth: '500px' }}>
          <p style={{ wordBreak: 'break-all', fontSize: '0.9rem' }}>
            <strong>UserOpHash:</strong> {userOpHash}
          </p>
          <p
            style={{
              marginTop: '10px',
              color: txStatus.includes('成功')
                ? 'green'
                : txStatus.includes('失敗')
                  ? 'red'
                  : 'blue',
            }}
          >
            <strong>ステータス:</strong> {txStatus || '不明'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Sample
