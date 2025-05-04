import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../../context/WalletContext';
import { getNFTs } from '../../utils/aaUtils';
import './NFTGallery.css';

interface NFT {
  id: string;
  tokenId: number;
  name: string;
  description: string;
  image: string;
}

interface NFTGalleryProps {
  latestTxHash?: string;
}

/**
 * Component for displaying owned NFTs
 */
const NFTGallery: React.FC<NFTGalleryProps> = ({ latestTxHash }) => {
  const { walletState } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load NFTs for the connected wallet
  const loadNFTs = useCallback(async () => {
    if (!walletState.isConnected || !walletState.address) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const fetchedNFTs = await getNFTs(walletState.address);
      setNfts(fetchedNFTs);
    } catch (err) {
      console.error('Error loading NFTs:', err);
      setError('Failed to load NFTs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [walletState.isConnected, walletState.address]);

  // Load NFTs when wallet connects or latest tx hash changes
  useEffect(() => {
    if (walletState.isConnected) {
      loadNFTs();
    } else {
      setNfts([]);
    }
  }, [walletState.isConnected, latestTxHash, loadNFTs]);

  // If wallet not connected, don't show anything
  if (!walletState.isConnected) {
    return null;
  }

  return (
    <div className="nft-gallery">
      <div className="gallery-header">
        <h3 className="gallery-title">YOUR NFT COLLECTION</h3>
        {nfts.length > 0 && (
          <button 
            onClick={loadNFTs} 
            className="refresh-btn"
            title="Refresh your NFT collection"
          >
            Refresh
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your NFTs...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadNFTs} className="btn btn-small">Try Again</button>
        </div>
      ) : nfts.length === 0 ? (
        <div className="empty-collection">
          <p>You don't have any NFTs yet. Mint your first one!</p>
        </div>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div key={nft.id} className="nft-card">
              <div className="nft-image-container">
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} className="nft-image" />
                ) : (
                  <div className="nft-placeholder"></div>
                )}
              </div>
              <div className="nft-details">
                <h4 className="nft-name">{nft.name}</h4>
                <p className="nft-id">ID: {nft.tokenId}</p>
                {nft.description && (
                  <p className="nft-description">{nft.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTGallery; 